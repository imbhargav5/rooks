import {
  useEffect,
  MutableRefObject,
  useRef,
  useCallback,
  useState
} from "react";
import { HTMLElementOrNull, CallbackRef } from "shared/utils";

/**
 * useOutsideClickRef hook
 *
 * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
 *
 * @param handler Callback to fire on outside click
 * @param when A boolean which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @param listenMouseDown A boolean which switches the hook to listen to `mousedown` event instead of `click`. Useful when user might start drag instead of regular clicks
 * @returns ref
 */
function useOutsideClickRef(
  handler: (e: MouseEvent) => any,
  when: boolean = true,
  listenMouseDown: boolean = false
): [CallbackRef] {
  const savedHandler = useRef(handler);

  const [node, setNode] = useState<HTMLElementOrNull>(null);

  const memoizedCallback = useCallback(
    (e: MouseEvent) => {
      if (node && !node.contains(e.target as Element)) {
        savedHandler.current(e);
      }
    },
    [node]
  );

  const mouseEvent = listenMouseDown ? "mousedown" : "click";

  useEffect(() => {
    savedHandler.current = handler;
  });

  const ref = useCallback((node: HTMLElementOrNull) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (when) {
      document.addEventListener(mouseEvent, memoizedCallback);
      document.addEventListener("ontouchstart", memoizedCallback);
      return () => {
        document.removeEventListener(mouseEvent, memoizedCallback);
        document.removeEventListener("ontouchstart", memoizedCallback);
      };
    }
  }, [when, memoizedCallback, mouseEvent]);

  return [ref];
}

export { useOutsideClickRef };
