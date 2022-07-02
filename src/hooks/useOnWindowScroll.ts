import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";

/**
 *
 * useOnWindowScroll hook
 * Fires a callback when window scroll
 *
 * @param {Function} callback Callback to be called before unmount
 * @param {boolean} when When the handler should be applied
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 */
function useOnWindowScroll(
  callback: (event: any) => void,
  when: boolean = true,
  isLayoutEffect: boolean = false
): void {
  if (typeof window !== "undefined") {
    useGlobalObjectEventListener(
      window,
      "scroll",
      callback,
      { passive: true },
      when,
      isLayoutEffect
    );
  } else {
    console.warn(
      "useOnWindowScroll can't attach an event listener as window is undefined."
    );
  }
}

export { useOnWindowScroll };
