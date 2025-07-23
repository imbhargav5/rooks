import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";
import type { ListenerOptions } from "@/types/utils";

/**
 *  useDocumentEventListener hook
 *
 * @description A react hook to an event listener to the document
 *
 * @param {keyof DocumentEventMap} eventName The event to track
 * @param {Function} callback The callback to be called on event
 * @param {ListenerOptions} listenerOptions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @see https://rooks.vercel.app/docs/hooks/useDocumentEventListener
 */
function useDocumentEventListener(
  eventName: keyof DocumentEventMap,
  callback: (...args: unknown[]) => void,
  listenerOptions: ListenerOptions = {},
  isLayoutEffect = false
): void {
  useGlobalObjectEventListener(
    global.document,
    eventName,
    callback,
    listenerOptions,
    true,
    isLayoutEffect
  );
}

export { useDocumentEventListener };
