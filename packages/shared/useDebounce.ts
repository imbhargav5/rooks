import { useRef, useEffect, useCallback, SyntheticEvent } from "react";
import debounce from "lodash.debounce";

/**
 * Debounce hook
 * @param {function} callback The callback to debounce
 * @param {number} wait The duration to debounce
 * @returns {function} The debounced callback
 */
function useDebounce(callback: Function, wait: number, options?: {}): Function {
  function createDebouncedCallback(fn: Function): Function {
    return debounce(fn, wait, options);
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
