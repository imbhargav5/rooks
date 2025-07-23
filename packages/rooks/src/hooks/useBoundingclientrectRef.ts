import { useState, useEffect, useCallback } from "react";
import type { CallbackRef, HTMLElementOrNull } from "../utils/utils";
import { useForkRef } from "./useForkRef";
import { useMutationObserverRef } from "./useMutationObserverRef";

/**
 * @param element HTML element whose boundingclientrect is needed
 * @returns DOMRect
 */
function getBoundingClientRect(element: HTMLElement): DOMRect {
  return element.getBoundingClientRect();
}

/**
 * useBoundingclientrectRef hook
 * Tracks the boundingclientrect of a React Ref and fires a callback when the element's size changes.
 *
 * @returns [CallbackRef | null, DOMRect | null, () => void]
 * @see https://rooks.vercel.app/docs/hooks/useBoundingclientRectRef
 */
function useBoundingclientrectRef(): [
  CallbackRef | null,
  DOMRect | null,
  () => void
] {
  const [domRect, setDomRect] = useState<DOMRect | null>(null);
  const [node, setNode] = useState<HTMLElementOrNull>(null);

  const update = useCallback(() => {
    setDomRect(node ? getBoundingClientRect(node) : null);
  }, [node]);

  useEffect(() => {
    update();
  }, [update]);

  const ref = useCallback((nodeElement: HTMLElement | null) => {
    setNode(nodeElement);
  }, []);

  const [mutationObserverRef] = useMutationObserverRef(update);

  const forkedRef = useForkRef(ref, mutationObserverRef);

  return [forkedRef, domRect, update];
}

export { useBoundingclientrectRef };
