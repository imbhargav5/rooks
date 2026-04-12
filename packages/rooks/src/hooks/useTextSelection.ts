import { useCallback, useRef, useSyncExternalStore } from "react";
import type { RefObject } from "react";

/**
 * The shape of the text selection state returned by useTextSelection.
 */
type TextSelectionState = {
  /** The selected text string. Empty string when nothing is selected. */
  text: string;
  /** Bounding DOMRect of the first selection range, or null when nothing is selected. */
  rect: DOMRect | null;
  /** Character offset within anchorNode where the selection starts. */
  startOffset: number;
  /** Character offset within focusNode where the selection ends. */
  endOffset: number;
  /** The node at which the selection begins, or null. */
  anchorNode: Node | null;
  /** The node at which the selection ends (the drag point), or null. */
  focusNode: Node | null;
};

const initialSelectionState: TextSelectionState = {
  text: "",
  rect: null,
  startOffset: 0,
  endOffset: 0,
  anchorNode: null,
  focusNode: null,
};

/**
 * Reads the current window.getSelection() and returns a TextSelectionState.
 * If `targetElement` is provided, returns empty state when the selection
 * falls outside that element.
 */
function readSelectionState(
  targetElement: HTMLElement | null
): TextSelectionState {
  if (typeof window === "undefined" || !window.getSelection) {
    return initialSelectionState;
  }

  const selection = window.getSelection();

  if (!selection || selection.isCollapsed) {
    return initialSelectionState;
  }

  const text = selection.toString();
  if (!text) {
    return initialSelectionState;
  }

  // When scoped to a target, ignore selections that stray outside it
  if (targetElement) {
    const { anchorNode, focusNode } = selection;
    if (
      !anchorNode ||
      !focusNode ||
      !targetElement.contains(anchorNode) ||
      !targetElement.contains(focusNode)
    ) {
      return initialSelectionState;
    }
  }

  let rect: DOMRect | null = null;
  if (selection.rangeCount > 0) {
    try {
      rect = selection.getRangeAt(0).getBoundingClientRect();
    } catch {
      // getBoundingClientRect can throw in detached-document edge cases
    }
  }

  return {
    text,
    rect,
    startOffset: selection.anchorOffset,
    endOffset: selection.focusOffset,
    anchorNode: selection.anchorNode,
    focusNode: selection.focusNode,
  };
}

/**
 * useTextSelection hook
 *
 * Tracks the currently selected text on the page or within a target element.
 * Listens to the native `selectionchange` event on the document. Returns an
 * empty selection state during SSR. When a `target` ref is provided the hook
 * automatically clears the selection state when the user clicks outside of
 * that element.
 *
 * @param target - Optional ref to an HTMLElement that scopes selection
 *   tracking. Defaults to the entire document.
 * @returns A tuple `[selectionState]` containing the current selection data.
 *
 * @example
 * // Track selection anywhere on the page
 * import { useTextSelection } from "rooks";
 *
 * export default function App() {
 *   const [{ text, rect }] = useTextSelection();
 *   return <p>You selected: {text}</p>;
 * }
 *
 * @example
 * // Scope tracking to a specific element
 * import { useRef } from "react";
 * import { useTextSelection } from "rooks";
 *
 * export default function Article() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const [{ text }] = useTextSelection(ref);
 *   return (
 *     <>
 *       <div ref={ref}>Select text from this element only.</div>
 *       <p>Selection: {text}</p>
 *     </>
 *   );
 * }
 *
 * @see https://rooks.vercel.app/docs/hooks/useTextSelection
 */
function useTextSelection(
  target?: RefObject<HTMLElement>
): [TextSelectionState] {
  const cacheRef = useRef<TextSelectionState>(initialSelectionState);

  // Store target in a ref so the subscribe function stays stable across renders
  const targetRef = useRef<RefObject<HTMLElement> | undefined>(target);
  targetRef.current = target;

  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof document === "undefined") {
      return () => {};
    }

    const handleSelectionChange = () => {
      cacheRef.current = readSelectionState(
        targetRef.current?.current ?? null
      );
      onStoreChange();
    };

    // When scoped to a target, clear state on mousedown outside that target
    const handleMouseDown = (event: MouseEvent) => {
      const targetElement = targetRef.current?.current;
      if (
        targetElement &&
        !targetElement.contains(event.target as Node) &&
        cacheRef.current.text !== ""
      ) {
        cacheRef.current = initialSelectionState;
        onStoreChange();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const getSnapshot = useCallback(() => cacheRef.current, []);

  const getServerSnapshot = useCallback(
    (): TextSelectionState => initialSelectionState,
    []
  );

  const selectionState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return [selectionState];
}

export { useTextSelection };
export type { TextSelectionState };
