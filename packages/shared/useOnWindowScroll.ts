import { useEffect, useRef } from "react";

/**
 *
 * useOnWindowScroll hook
 * Fires a callback when window scroll
 * @param {function} callback Callback to be called before unmount
 * @param {boolean} when When the handler should be applied
 */
function useOnWindowScroll(callback: (event: any)=>void, when:boolean = true): void {
  const savedHandler = useRef(callback);

  useEffect(() => {
    savedHandler.current = callback;    
  })

  useEffect(() => {
    if (when) {
      function passedCb(event) {
        savedHandler.current(event);
      }
      window.addEventListener("scroll", passedCb);
      return () => window.removeEventListener("scroll", passedCb);
    }
  }, [when]);
}

export { useOnWindowScroll };
