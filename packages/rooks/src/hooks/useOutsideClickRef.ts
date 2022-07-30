import { useEffect, useRef, useCallback, useState } from "react";
import type { HTMLElementOrNull, CallbackRef } from "../utils/utils";
import { noop } from "@/utils/noop";

/**
 * useOutsideClickRef hook
 * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
 *
 * @param handler Callback to fire on outside click
 * @param when A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @returns An array with first item being ref
 * @see https://react-hooks.org/docs/useOutsideClick
 */
function useOutsideClickRef(
  handler: (event: MouseEvent) => void,
  when = true
): [CallbackRef] {
  const savedHandler = useRef(handler);

  const [node, setNode] = useState<HTMLElementOrNull>(null);

  const memoizedCallback = useCallback(
    (event: MouseEvent) => {
      if (node && !node.contains(event.target as Element)) {
        savedHandler.current(event);
      }
    },
    [node]
  );

  useEffect(() => {
    savedHandler.current = handler;
  });

  const ref = useCallback((nodeElement: HTMLElementOrNull) => {
    setNode(nodeElement);
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

    return noop;
  }, [when, memoizedCallback]);

  return [ref];
}

export { useOutsideClickRef };
