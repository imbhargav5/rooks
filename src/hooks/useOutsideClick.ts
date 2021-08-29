import type { MutableRefObject } from "react";
import { useEffect, useRef, useCallback } from "react";

/**
 *  useOutsideClick hook
 * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
 *
 * @param ref Ref whose outside click needs to be listened to
 * @param handler Callback to fire on outside click
 * @param when A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @param detectIframe A boolean which enables detecting click on outside iframe
 * # caveats for iframe
 * will only detect the first click on iframe, need to focus back to window, and click on iframe to detect again
 * don't call alert on handler when using iframe
 * focus to iframe via tab navigation also triggers window.blur
 */
function useOutsideClick(
  ref: MutableRefObject<HTMLElement | null>,
  handler: (event: FocusEvent | MouseEvent) => any,
  when: boolean = true,
  detectIframe: boolean = true
): void {
  const savedHandler = useRef(handler);

  const memoizedCallback = useCallback((event: MouseEvent) => {
    if (ref?.current && !ref.current.contains(event.target as Element)) {
      savedHandler.current(event);
    }
  }, []);

  const memoizedOnBlurCallback = useCallback((event: FocusEvent) => {
    // Note: on firefox clicking on iframe triggers blur, but only on
    // next event loop it becomes document.activeElement
    // https://stackoverflow.com/q/2381336#comment61192398_23231136
    setTimeout(() => {
      if (document.activeElement?.tagName === "IFRAME") {
        savedHandler.current(event);
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (when) {
      document.addEventListener("click", memoizedCallback, true);
      document.addEventListener("ontouchstart", memoizedCallback, true);
      if (detectIframe) window.addEventListener("blur", memoizedOnBlurCallback);

      return () => {
        document.removeEventListener("click", memoizedCallback, true);
        document.removeEventListener("ontouchstart", memoizedCallback, true);
        if (detectIframe)
          window.removeEventListener("blur", memoizedOnBlurCallback);
      };
    }
  }, [ref, handler, when]);
}

export { useOutsideClick };
