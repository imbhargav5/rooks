import { useEffect } from 'react';
import type { RefElementOrNull } from '../utils/utils';
import { useFreshTick } from './useFreshTick';
import { useIsomorphicEffect } from './useIsomorphicEffect';
import { useRefElement } from './useRefElement';

/**
 *  useEventListenerRef hook
 *
 *  A react hook to an event listener to an element
 *  Returns a ref
 *
 * @param {string} eventName The event to track
 * @param {Function} callback The callback to be called on event
 * @param {object} conditions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @returns {Function} A callback ref that can be used as ref prop
 */
function useEventListenerRef(
  eventName: string,
  callback: (...args: any) => void,
  listenerOptions: any = {},
  isLayoutEffect: boolean = false
): (refElement: RefElementOrNull<HTMLElement>) => void {
  const [ref, element] = useRefElement<HTMLElement>();
  const freshCallback = useFreshTick(callback);
  const { capture, passive, once } = listenerOptions;
  const useEffectToRun = isLayoutEffect ? useIsomorphicEffect : useEffect;

  useEffectToRun(() => {
    if (!(element && element.addEventListener)) {
      return;
    }
    element.addEventListener(eventName, freshCallback, listenerOptions);

    return () => {
      element.removeEventListener(eventName, freshCallback, listenerOptions);
    };
  }, [element, eventName, capture, passive, once]);

  return ref;
}

export { useEventListenerRef };
