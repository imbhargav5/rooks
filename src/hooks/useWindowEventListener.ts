import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";
import { warning } from "./warning";

/**
 *  useWindowEventListener hook
 *
 *  A react hook to an event listener to the window
 *
 * @param {string} eventName The event to track
 * @param {Function} callback The callback to be called on event
 * @param {object} conditions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @returns {undefined}
 */
function useWindowEventListener(
  eventName: string,
  callback: (...args: unknown[]) => void,
  listenerOptions: AddEventListenerOptions,
  isLayoutEffect: boolean = false
): void {
  if (typeof window === "undefined") {
    warning(
      false,
      "useWindowEventListener can't attach an event listener as window is undefined."
    );
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGlobalObjectEventListener(
      window,
      eventName,
      callback,
      listenerOptions,
      true,
      isLayoutEffect
    );
  }
}

export { useWindowEventListener };
