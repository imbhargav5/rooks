import { useEffect } from "react";
import { useFreshTick } from "./useFreshTick";
import { useIsomorphicEffect } from "./useIsomorphicEffect";
import { warning } from "./warning";

/**
 *  useGlobalObjectEventListener hook
 *
 *  A react hook to an event listener to a global object
 *
 * @param {Window|Document} globalObject The global object to add event onto
 * @param {string} eventName The event to track
 * @param {Function} callback The callback to be called on event
 * @param {object} conditions The options to be passed to the event listener
 * @param {boolean} when Should the event listener be active
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @returns {undefined}
 */
function useGlobalObjectEventListener(
  globalObject: Document | Window,
  eventName: string,
  callback: (...args: any) => void,
  listenerOptions: any = {},
  when: boolean = true,
  isLayoutEffect: boolean = false
): void {
  const freshCallback = useFreshTick(callback);
  const { capture, passive, once } = listenerOptions;
  const useEffectToRun = isLayoutEffect ? useIsomorphicEffect : useEffect;

  useEffectToRun(() => {
    warning(
      typeof globalObject !== "undefined",
      "[useGlobalObjectEventListener]: Cannot attach event handlers to undefined."
    );
    if (
      typeof globalObject !== "undefined" &&
      globalObject.addEventListener &&
      when
    ) {
      globalObject.addEventListener(eventName, freshCallback, listenerOptions);

      return () => {
        globalObject.removeEventListener(
          eventName,
          freshCallback,
          listenerOptions
        );
      };
    }

    return () => {};
  }, [eventName, capture, passive, once]);
}

export { useGlobalObjectEventListener };
