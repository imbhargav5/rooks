import { AnyFunction } from "@/types/utils";
import type { DebouncedFunc, DebounceSettings } from "lodash";
import debounce from "lodash.debounce";
import { useRef, useCallback } from "react";
import { useFreshRef } from "./useFreshRef";
import { useWillUnmount } from "./useWillUnmount";

type CanAlsoReturnVoid<T extends AnyFunction> = T | (() => void);

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
 * @see https://rooks.vercel.app/docs/useDebounce
 */
function useDebounce<T extends AnyFunction>(
  callback: T,
  wait?: number,
  options?: DebounceSettings
) {
  const createDebouncedCallback = useCallback(
    (function_: CanAlsoReturnVoid<T>): DebouncedFunc<T> => {
      return debounce(function_, wait, options);
    },
    [wait, options]
  );

  const freshCallback = useFreshRef(callback);

  function tick(...args: Parameters<T>) {
    freshCallback.current?.(...args);
  }

  const debouncedCallbackRef = useRef<DebouncedFunc<T>>(
    createDebouncedCallback(tick)
  );

  useWillUnmount(() => {
    return debouncedCallbackRef.current?.cancel();
  });

  return debouncedCallbackRef.current;
}

export { useDebounce };
