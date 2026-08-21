import { useEffect } from "react";
import type { ListenerOptions } from "@/types/utils";
import { useEventListener } from "./useEventListener";
import { warning } from "./warning";

function useGlobalObjectEventListener(
  globalObject: Document | undefined,
  eventName: keyof DocumentEventMap,
  callback: EventListener,
  listenerOptions: ListenerOptions,
  when: boolean,
  isLayoutEffect: boolean
): void;

function useGlobalObjectEventListener(
  globalObject: Window | undefined,
  eventName: keyof WindowEventMap,
  callback: EventListener,
  listenerOptions: ListenerOptions,
  when: boolean,
  isLayoutEffect: boolean
): void;

/**
 *  useGlobalObjectEventListener hook
 *
 *  A react hook to an event listener to a global object
 *
 * @param {Window|Document} globalObject The global object to add event onto
 * @param {string} eventName The event to track
 * @param {Function} callback The callback to be called on event
 * @param {ListenerOptions} listenerOptions The options to be passed to the event listener
 * @param {boolean} when Should the event listener be active
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @see https://rooks.vercel.app/docs/hooks/useGlobalObjectEventListener
 */
function useGlobalObjectEventListener<
  GlobalObject extends Window | Document | undefined,
>(
  globalObject: GlobalObject,
  eventName: keyof DocumentEventMap | keyof WindowEventMap,
  callback: EventListener,
  listenerOptions: ListenerOptions = {},
  when = true,
  isLayoutEffect = false
): void {
  useEffect(() => {
    warning(
      typeof window === "undefined" || typeof globalObject !== "undefined",
      "[useGlobalObjectEventListener]: Cannot attach event handlers to undefined."
    );
  }, [globalObject]);

  useEventListener<EventTarget, string>(eventName, callback, {
    target: globalObject as EventTarget | undefined,
    listenerOptions,
    when,
    isLayoutEffect,
  });
}

export { useGlobalObjectEventListener };
