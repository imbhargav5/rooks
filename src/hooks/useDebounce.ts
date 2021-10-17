import type { DebouncedFunc } from "lodash";
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
function useDebounce<T extends (...args: any[]) => unknown>(
  callback: T,
  wait: number,
  options?: {}
): DebouncedFunc<T> {
  const createDebouncedCallback = useCallback(
    (function_: T): DebouncedFunc<T> => {
      return debounce(function_, wait, options);
    },
    [wait, options]
  );

  const callbackRef = useRef<T>(callback);
  const debouncedCallbackRef = useRef<DebouncedFunc<T>>(
    createDebouncedCallback(callback)
  );

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    debouncedCallbackRef.current = createDebouncedCallback(callbackRef.current);
  }, [wait, options, createDebouncedCallback]);

  return debouncedCallbackRef.current;
}

export { useDebounce };
