import debounce from "lodash.debounce";
import { useRef, useEffect, useCallback } from "react";

/**
 * Debounce hook
 * Debounces a function
 *
 * @param {Function} callback The callback to debounce
 * @param {number} wait The duration to debounce
 * @returns {Function} The debounced callback
 */
function useDebounce(callback: Function, wait: number, options?: {}): Function {
  const createDebouncedCallback = useCallback(
    (function_: Function): Function => {
      return debounce(function_, wait, options);
    },
    [wait, options]
  );

  const callbackRef = useRef<Function>(callback);
  const debouncedCallbackRef = useRef<Function>(
    createDebouncedCallback(callback)
  );

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    debouncedCallbackRef.current = createDebouncedCallback((...args: any[]) => {
      callbackRef.current(...args);
    });
  }, [wait, options, createDebouncedCallback]);

  return debouncedCallbackRef.current;
}

export { useDebounce };
