/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable guard-for-in */
import { useKey } from './useKey';

type Options = {
  /**
   * Condition which if true, will enable the event listeners
   */
  when?: boolean;
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
