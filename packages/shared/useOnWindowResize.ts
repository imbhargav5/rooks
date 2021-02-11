import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";

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
  useGlobalObjectEventListener(window,"resize", callback, {passive: true}, when, isLayoutEffect)
}

export { useOnWindowResize };
