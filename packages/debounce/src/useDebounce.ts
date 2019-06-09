import { useRef, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

/**
 * Debounce hook
 * @param {function} callback The callback to debounce
 * @param {number} wait The duration to debounce
 * @returns {function} The debounced callback
 */
function useDebounce(callback: Function, wait: number): Function {
  function createDebouncedCallback(fn: Function): Function {
    return debounce(fn, wait);
  }

  const callbackRef = useRef<Function>(callback);
  const debouncedCallbackRef = useRef<Function>(
    createDebouncedCallback(callback)
  );

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    debouncedCallbackRef.current = createDebouncedCallback(() => {
      callbackRef.current();
    });
  }, [wait]);

  return debouncedCallbackRef.current;
}

export { useDebounce };
