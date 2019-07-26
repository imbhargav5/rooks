import { useEffect, useRef } from "react";

/**
 *
 * useOnWindowResize hook
 *
 * Fires a callback when window resizes
 *
 * @param {function} callback Callback to be called before unmount
 * @param {boolean} when When the handler should be applied
 */
function useOnWindowResize(handler, when = true) {
  const savedHandler = useRef(handler);

  useEffect(() => (savedHandler.current = handler));
  useEffect(() => {
    if (when) {
      window.addEventListener("resize", savedHandler.current);
      return () => window.removeEventListener("resize", savedHandler.current);
    }
  }, [when]);
}

export { useOnWindowResize };
