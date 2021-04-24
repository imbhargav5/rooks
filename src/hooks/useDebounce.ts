import debounce from 'lodash.debounce';
import { useRef, useEffect, useCallback, SyntheticEvent } from 'react';

/**
 * Debounce hook
 *
 * @param {Function} callback The callback to debounce
 * @param {number} wait The duration to debounce
 * @returns {Function} The debounced callback
 */
function useDebounce(callback: Function, wait: number, options?: {}): Function {
  function createDebouncedCallback(function_: Function): Function {
    return debounce(function_, wait, options);
  }

  const callbackRef = useRef<Function>(callback);
  const debouncedCallbackRef = useRef<Function>(
    createDebouncedCallback(callback)
  );

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    debouncedCallbackRef.current = createDebouncedCallback((...args) => {
      callbackRef.current(...args);
    });
  }, [wait, options]);

  return debouncedCallbackRef.current;
}

export { useDebounce };
