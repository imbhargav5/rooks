import {
  useEffect,
  MutableRefObject,
  useRef,
  useCallback,
  useState,
} from "react";
import type { HTMLElementOrNull, CallbackRef } from "../utils/utils";

/**
 * useOutsideClickRef hook
 * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
 *
 * @param handler Callback to fire on outside click
 * @param when A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @returns An array with first item being ref
 */
function useOutsideClickRef(
  handler: (e: MouseEvent) => any,
  when: boolean = true
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

  useEffect(() => {
    savedHandler.current = handler;
  });

  const ref = useCallback((node: HTMLElementOrNull) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (when) {
      document.addEventListener("click", memoizedCallback, true);
      document.addEventListener("ontouchstart", memoizedCallback, true);

      return () => {
        document.removeEventListener("click", memoizedCallback, true);
        document.removeEventListener("ontouchstart", memoizedCallback, true);
      };
    }
  }, [when, memoizedCallback]);

  return [ref];
}

export { useOutsideClickRef };
