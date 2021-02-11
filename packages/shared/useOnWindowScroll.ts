import { useEffect, useRef } from "react";
import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";

/**
 *
 * useOnWindowScroll hook
 * Fires a callback when window scroll
 * @param {function} callback Callback to be called before unmount
 * @param {boolean} when When the handler should be applied
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 */
function useOnWindowScroll(callback: (event: any)=>void, when:boolean = true, isLayoutEffect: boolean = false): void {
  useGlobalObjectEventListener(window,"scroll", callback, {passive: true}, when, isLayoutEffect)
}

export { useOnWindowScroll };
