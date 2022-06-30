import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";
import type { ListenerOptions } from "@/types/utils";

/**
 *  useWindowEventListener hook
 *
 *  A react hook to an event listener to the window
 *
 * @param {string} eventName The event to track
 * @param {Function} callback The callback to be called on event
 * @param {ListenerOptions} listenerOptions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @returns {undefined}
 */
function useWindowEventListener(
  eventName: string,
  callback: (...args: any) => void,
  listenerOptions: ListenerOptions = {},
  isLayoutEffect: boolean = false
): void {
  useGlobalObjectEventListener(
    window,
    eventName,
    callback,
    listenerOptions,
    true,
    isLayoutEffect
  );
}

export { useWindowEventListener };