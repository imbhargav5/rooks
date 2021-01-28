import { useEffect, useRef } from "react";
import { useIsomorphicEffect } from "./useIsomorphicEffect";

/**
 *
 * useOnWindowResize hook
 *
 * Fires a callback when window resizes
 *
 * @param {function} callback Callback to be called before unmount
 * @param {boolean} when When the handler should be applied
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 */
function useOnWindowResize(callback: (event : any)=>void, when : boolean = true, isLayoutEffect: boolean = false) {
  const savedHandler = useRef(callback);
  const useEffectToRun = isLayoutEffect ? useIsomorphicEffect : useEffect
  
  useEffectToRun(() => {
    savedHandler.current = callback;    
  })

  useEffectToRun(() => {
    if (when) {
      function passedCb(event) {
        savedHandler.current(event);
      }
      window.addEventListener("resize", passedCb);
      return () => window.removeEventListener("resize", passedCb);
    }
  }, [when]);
}

export { useOnWindowResize };
