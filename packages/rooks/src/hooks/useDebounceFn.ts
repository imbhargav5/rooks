/**
 * useDebounceFn
 * @description Powerful debounce function hook for React
 * @see {@link https://rooks.vercel.app/docs/hooks/useDebounceFn}
 */
import { useRef, useCallback, useState } from "react";
import { useFreshCallback } from "./useFreshCallback";
import { useTimeoutWhen } from "./useTimeoutWhen";

type AnyFunction = (...args: unknown[]) => unknown;

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

function useDebounceFn<F extends AnyFunction>(
  func: F,
  delay: number,
  options: DebounceOptions = { leading: false, trailing: true }
): [(...args: Parameters<F>) => void, boolean] {
  const { leading, trailing, maxWait } = options;
  if (!leading && !trailing) {
    throw new Error("leading and trailing cannot both be false");
  } else if (typeof maxWait !== "undefined" && maxWait < delay) {
    throw new Error("maxWait cannot be less than delay");
  }
  const funcRef = useFreshCallback(func);
  const [isTimeoutEnabled, setIsTimeoutEnabled] = useState<boolean>(false);
  // we use key to reset a timeout when the key changes
  const [key, setKey] = useState<number>(0);
  const lastExecutionTimeRef = useRef<number>(0);
  const argsRef = useRef<Parameters<F> | undefined>(undefined);

  const debouncedFn = useCallback(
    (...args: Parameters<F>) => {
      argsRef.current = args;
      const overrideTimeout =
        typeof maxWait !== "undefined" &&
        lastExecutionTimeRef.current &&
        Date.now() - lastExecutionTimeRef.current > maxWait;
      // If the leading edge is enabled, we should call the function
      // immediately
      // if timeout is not enabled, we should call the function
      if (leading) {
        if (isTimeoutEnabled && overrideTimeout) {
          // reset the timeout
          setKey((prevKey) => prevKey + 1);
          lastExecutionTimeRef.current = Date.now();
          try {
            funcRef(...args);
          } catch (error) {
            console.warn(error);
          }
        } else if (overrideTimeout && !isTimeoutEnabled) {
          setIsTimeoutEnabled(true);
          lastExecutionTimeRef.current = Date.now();
          try {
            funcRef(...args);
          } catch (error) {
            console.warn(error);
          }
        } else if (isTimeoutEnabled && !overrideTimeout) {
          // do nothing
        } else {
          // !isTimeoutEnabled && !overrideTimeout
          setIsTimeoutEnabled(true);
          lastExecutionTimeRef.current = Date.now();
          try {
            funcRef(...args);
          } catch (error) {
            console.warn(error);
          }
        }
      }

      if (trailing) {
        // trailing scenarios
        if (isTimeoutEnabled) {
          // reset the timeout
          setKey((prevKey) => prevKey + 1);
        } else {
          // set the timeout
          setIsTimeoutEnabled(true);
        }
      }
    },
    [maxWait, isTimeoutEnabled, leading, trailing, funcRef]
  );

  // if timeout is enabled, is trailing and maxWait is defined, we should clear the timeout
  // and call the function
  useTimeoutWhen(
    () => {
      // noop condition but for typechecking
      if (typeof maxWait !== "undefined" && trailing) {
        if (!argsRef.current) return;
        lastExecutionTimeRef.current = Date.now();
        try {
          funcRef(...argsRef.current);
        } catch (error) {
          console.warn(error);
        }
      }
    },
    maxWait ?? Infinity,
    isTimeoutEnabled && typeof maxWait !== "undefined" && trailing,
    key
  );

  useTimeoutWhen(
    () => {
      if (trailing) {
        if (!argsRef.current) return;
        lastExecutionTimeRef.current = Date.now();
        try {
          funcRef(...argsRef.current);
        } catch (error) {
          console.warn(error);
        }
      }
      setIsTimeoutEnabled(false);
    },
    delay,
    isTimeoutEnabled && trailing,
    key
  );

  const freshDebouncedFn = useFreshCallback(debouncedFn as any);

  return [freshDebouncedFn, isTimeoutEnabled];
}

export { useDebounceFn };
