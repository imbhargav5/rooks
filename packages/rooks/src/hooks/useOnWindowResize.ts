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
 * @see https://react-hooks.org/docs/useOnWindowResize
 */
function useOnWindowResize(
  callback: EventListener,
  when = true,
  isLayoutEffect = false
) {
  if (typeof window !== "undefined") {
    /*
    Since the above condition changes values only across different environments, it is fine to call the hook conditionally
    */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGlobalObjectEventListener(
      window,
      "resize",
      callback,
      { passive: true },
      when,
      isLayoutEffect
    );
  }
}

export { useOnWindowResize };
