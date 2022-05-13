import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";

/**
 *  useDocumentEventListener hook
 *
 *  A react hook to an event listener to the document
 *
 * @param {string} eventName The event to track
 * @param {Function} callback The callback to be called on event
 * @param {object} conditions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @returns {undefined}
 */
function useDocumentEventListener(
  eventName: string,
  callback: (...args: any) => void,
  listenerOptions: any = {},
  isLayoutEffect: boolean = false
): void {
  useGlobalObjectEventListener(
    document,
    eventName,
    callback,
    listenerOptions,
    true,
    isLayoutEffect
  );
}

export { useDocumentEventListener };
