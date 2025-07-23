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
 * @see https://rooks.vercel.app/docs/hooks/useOnWindowResize
 */
function useOnWindowResize(
  callback: EventListener,
  when = true,
  isLayoutEffect = false
) {
  useGlobalObjectEventListener(
    global.window,
    "resize",
    callback,
    { passive: true },
    when,
    isLayoutEffect
  );
}

export { useOnWindowResize };
