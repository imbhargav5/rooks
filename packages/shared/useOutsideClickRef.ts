import {
  useEffect,
  MutableRefObject,
  useRef,
  useCallback,
  useState
} from "react";
import { HTMLElementOrNull, CallbackRef } from "./utils/utils";

/**
 * useOutsideClickRef hook
 * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
 * @param handler Callback to fire on outside click
 * @param when A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @returns ref
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
      document.addEventListener("click", memoizedCallback);
      document.addEventListener("ontouchstart", memoizedCallback);
      return () => {
        document.removeEventListener("click", memoizedCallback);
        document.removeEventListener("ontouchstart", memoizedCallback);
      };
    }
  }, [when, memoizedCallback]);

  return [ref];
}

export { useOutsideClickRef };
