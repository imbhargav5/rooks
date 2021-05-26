/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable guard-for-in */
import type { Ref } from 'react';
import { useKey } from './useKey';

type Options = {
  /**
   * Condition which if true, will enable the event listeners
   */
  when?: boolean;
  /**
   * Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp
   */
  eventTypes?: Array<number | string>;
  /**
   * target ref on which the events should be listened. If no target is specified,
   * events are listened to on the window
   */
  target?: Ref<HTMLElement>;
};

/**
 * useKeyBindings
 *
 * useKeyBindings can bind multiple keys to multiple callbacks and fire the callbacks on key press.
 *
 * @param { [key: string]: () => void } keys
 * @param {Options} options
 */
const useKeyBindings = (
  keys: { [key: string]: () => void },
  options_?: Options
) => {
  for (const key in keys) {
    useKey(key, keys[key], options_);
  }
};

export { useKeyBindings };
