import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";

/**
 *
 * useOnWindowScroll hook
 * Fires a callback when window scroll
 *
 * @param {Function} callback Callback to be called before unmount
 * @param {boolean} when When the handler should be applied
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @see https://react-hooks.org/docs/useOnWindowScroll
 *
 */
function useOnWindowScroll(
  callback: EventListener,
  when = true,
  isLayoutEffect = false
): void {
  let windowOrNull = null;
  if (typeof window !== "undefined") {
    windowOrNull = window;
  }
  useGlobalObjectEventListener(
    windowOrNull,
    "scroll",
    callback,
    { passive: true },
    when,
    isLayoutEffect
  );
}

export { useOnWindowScroll };
