import type { RefElementOrNull } from "../utils/utils";
import { useRefElement } from "./useRefElement";
import { useEventListener } from "./useEventListener";

/**
 *  useEventListenerRef hook
 *
 *  A react hook to an event listener to an element
 *  Returns a ref
 *
 * @param {string} eventName The event to track`
 * @param {Function} callback The callback to be called on event
 * @param {object} listenerOptions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @returns {Function} A callback ref that can be used as ref prop
 * @see https://rooks.vercel.app/docs/hooks/useEventListenerRef
 */
function useEventListenerRef(
  eventName: string,
  callback: (...args: unknown[]) => void,
  listenerOptions:
    | AddEventListenerOptions
    | EventListenerOptions
    | boolean = {},
  isLayoutEffect = false
): (refElement: RefElementOrNull<HTMLElement>) => void {
  const [ref, element] = useRefElement<HTMLElement>();

  useEventListener<EventTarget, string>(
    eventName,
    callback as (event: Event) => void,
    {
      target: element as EventTarget | null,
      listenerOptions,
      isLayoutEffect,
    }
  );

  return ref;
}

export { useEventListenerRef };
