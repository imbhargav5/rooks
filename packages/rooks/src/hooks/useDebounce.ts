import { UnknownFunction } from "@/types/utils";
import type { DebouncedFunc, DebounceSettings } from "lodash";
import debounce from "lodash.debounce";
import { useRef, useEffect, useCallback } from "react";

/**
 * Debounce hook
 * Debounces a function
 *
 * @param callback The callback to debounce
 * @param wait The duration to debounce
 * @param options The options object.
 * @param options.leading Specify invoking on the leading edge of the timeout.
 * @param options.maxWait The maximum time func is allowed to be delayed before it’s invoked.
 * @param options.trailing Specify invoking on the trailing edge of the timeout.
 * @returns Returns the new debounced function.
 * @see https://react-hooks.org/docs/useDebounce
 */
function useDebounce<T extends UnknownFunction>(
  callback: T,
  wait?: number,
  options?: DebounceSettings
) {
  const createDebouncedCallback = useCallback(
    (function_: T): DebouncedFunc<T> => {
      return debounce(function_, wait, options);
    },
    [wait, options]
  );

  const debouncedCallbackRef = useRef<DebouncedFunc<T>>(
    createDebouncedCallback(callback)
  );

  useEffect(() => {
    debouncedCallbackRef.current = createDebouncedCallback(callback);
    return () => debouncedCallbackRef.current?.cancel();
  }, [callback, createDebouncedCallback]);

  return debouncedCallbackRef.current;
}

export { useDebounce };
