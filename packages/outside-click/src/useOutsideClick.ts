import { useEffect, MutableRefObject, useRef, useCallback } from "react";

/**
 * useOutsideClick hook
 *
 * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
 *
 * @param ref Ref whose outside click needs to be listened to
 * @param handler Callback to fire on outside click
 * @param when A boolean which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @param listenMouseDown A boolean which switches the hook to listen to `mousedown` event instead of `click`. Useful when user might start drag instead of regular clicks
 */
function useOutsideClick(
  ref: MutableRefObject<HTMLElement>,
  handler: (e: MouseEvent) => any,
  when: boolean = true,
  listenMouseDown: boolean = false
): void {
  const savedHandler = useRef(handler);

  const memoizedCallback = useCallback((e: MouseEvent) => {
    if (ref && ref.current && !ref.current.contains(e.target as Element)) {
      savedHandler.current(e);
    }
  }, []);

  const mouseEvent = listenMouseDown ? "mousedown" : "click";

  useEffect(() => {
    savedHandler.current = handler;
  });

  useEffect(() => {
    if (when) {
      document.addEventListener(mouseEvent, memoizedCallback);
      document.addEventListener("ontouchstart", memoizedCallback);
      return () => {
        document.removeEventListener(mouseEvent, memoizedCallback);
        document.removeEventListener("ontouchstart", memoizedCallback);
      };
    }
  }, [ref, handler, when, mouseEvent]);
}

export { useOutsideClick };
