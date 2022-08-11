import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";
import type { ListenerOptions } from "@/types/utils";

/**
 *  useDocumentEventListener hook
 *
 * @description A react hook to an event listener to the document
 *
 * @param {string} eventName The event to track
 * @param {Function} callback The callback to be called on event
 * @param {ListenerOptions} listenerOptions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @see https://react-hooks.org/docs/useDocumentEventListener
 */
function useDocumentEventListener(
  eventName: string,
  callback: (...args: unknown[]) => void,
  listenerOptions: ListenerOptions = {},
  isLayoutEffect = false
): void {
  if (typeof document !== "undefined") {
    /*
    Since the above condition changes values only across different environments, it is fine to call the hook conditionally
    */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGlobalObjectEventListener(
      document,
      eventName,
      callback,
      listenerOptions,
      true,
      isLayoutEffect
    );
  }
}

export { useDocumentEventListener };
