import { useKey } from './useKey';
import type { Ref } from 'react';

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
 * useKeyBindings binds pairs of keyboard events and handlers
 *
 * @param { [key: string]: () => void } keys
 * @param {Options} options
 */
const useKeyBindings = (
  keyBindings: { [key: string]: () => void },
  options_?: Options
) => {
  for (const key in keyBindings) {
    useKey(key, keyBindings[key], options_);
  }
};

export { useKeyBindings };
