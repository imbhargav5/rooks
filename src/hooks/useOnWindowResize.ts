import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";

/**
 *
 * useOnWindowResize hook
 *
 * Fires a callback when window resizes
 *
 * @param {Function} callback Callback to be called before unmount
 * @param {boolean} when When the handler should be applied
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 */
function useOnWindowResize(
  callback: (event: any) => void,
  when: boolean = true,
  isLayoutEffect: boolean = false
) {
  if (typeof window !== "undefined") {
    useGlobalObjectEventListener(
      window,
      "resize",
      callback,
      { passive: true },
      when,
      isLayoutEffect
    );
  } else {
    console.warn(
      "useOnWindowResize can't attach an event listener as window is undefined."
    );
  }
}

export { useOnWindowResize };
