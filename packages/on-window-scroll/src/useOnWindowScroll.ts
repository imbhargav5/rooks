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

  useEffect(() => (savedHandler.current = callback));
  useEffect(() => {
    if (when) {
      window.addEventListener("scroll", savedHandler.current);
      return () => window.removeEventListener("scroll", savedHandler.current);
    }
  }, [when]);
}

export { useOnWindowScroll };
