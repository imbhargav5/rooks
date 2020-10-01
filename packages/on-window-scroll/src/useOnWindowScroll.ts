import { useEffect, useRef } from "react";

/**
 *
 * useOnWindowScroll hook
 *
 * Fires a callback when window scroll
 *
 * @param {function} callback Callback to be called before unmount
 * @param {boolean} when When the handler should be applied
 */
function useOnWindowScroll(callback, when = true) {
  const savedHandler = useRef(callback);

  useEffect(() => {
    savedHandler.current = callback;
    if (when) {
      function passedCb(...args) {
        savedHandler.current(...args);
      }
      window.addEventListener("scroll", passedCb);
      return () => window.removeEventListener("scroll", passedCb);
    }
  }, [when]);
}

export { useOnWindowScroll };
