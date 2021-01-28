import { useEffect, useRef } from "react";
import { useIsomorphicEffect } from "./useIsomorphicEffect";

/**
 *
 * useOnWindowScroll hook
 * Fires a callback when window scroll
 * @param {function} callback Callback to be called before unmount
 * @param {boolean} when When the handler should be applied
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 */
function useOnWindowScroll(callback: (event: any)=>void, when:boolean = true, isLayoutEffect: boolean = false): void {
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
      window.addEventListener("scroll", passedCb);
      return () => window.removeEventListener("scroll", passedCb);
    }
  }, [when]);
}

export { useOnWindowScroll };
