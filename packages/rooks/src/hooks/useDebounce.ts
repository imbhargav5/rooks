import { AnyFunction } from "@/types/utils";
import debounce from "lodash.debounce";
import { useRef, useCallback } from "react";
import { useFreshRef } from "./useFreshRef";
import { useWillUnmount } from "./useWillUnmount";

// Define the types inline if we can't import them
interface DebounceSettings {
  leading?: boolean;
  maxWait?: number;
  trailing?: boolean;
}

// This is a simpler version that matches what we're using
type DebouncedFunction<T extends (...args: any[]) => any> = T & {
  cancel(): void;
  flush(): ReturnType<T> | undefined;
};

type CanAlsoReturnVoid<T extends AnyFunction> = T | (() => void);

/**
 * Debounce hook
 * Debounces a function
 *
 * @param callback The callback to debounce
 * @param wait The duration to debounce
 * @param options The options object.
 * @param options.leading Specify invoking on the leading edge of the timeout.
 * @param options.maxWait The maximum time func is allowed to be delayed before it's invoked.
 * @param options.trailing Specify invoking on the trailing edge of the timeout.
 * @returns Returns the new debounced function.
 * @see https://rooks.vercel.app/docs/hooks/useDebounce
 */
function useDebounce<T extends AnyFunction>(
  callback: T,
  wait?: number,
  options?: DebounceSettings
) {
  const createDebouncedCallback = useCallback(
    (function_: CanAlsoReturnVoid<T>) => {
      return debounce(function_, wait, options) as DebouncedFunction<T>;
    },
    [wait, options]
  );

  const freshCallback = useFreshRef(callback);

  function tick(...args: Parameters<T>) {
    freshCallback.current?.(...args);
  }

  const debouncedCallbackRef = useRef<DebouncedFunction<T>>(
    createDebouncedCallback(tick)
  );

  useWillUnmount(() => {
    debouncedCallbackRef.current?.cancel();
  });

  return debouncedCallbackRef.current;
}

export { useDebounce };
