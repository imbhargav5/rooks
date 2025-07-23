import { useState, useEffect, useCallback, useRef } from "react";
import { noop } from "@/utils/noop";

type Callback<T> = (...args: T[]) => void;

/**
 * useThrottle
 * Throttles a function with a timeout and ensures
 * that the callback function runs at most once in that duration
 *
 * @param callback The callback to throttle
 * @param timeout Throttle timeout
 * @returns [Callback, isReady] The throttled callback and if it is currently throttled
 * @see https://rooks.vercel.app/docs/hooks/useThrottle
 */
function useThrottle<T>(
  callback: Callback<T>,
  timeout = 300
): [Callback<T>, boolean] {
  const [ready, setReady] = useState(true);
  const timerRef = useRef<number | undefined>(undefined);

  const throttledFunction = useCallback(
    (...args: T[]) => {
      if (!ready) {
        return;
      }

      setReady(false);
      callback(...args);
    },
    [ready, callback]
  );

  useEffect(() => {
    if (!ready) {
      timerRef.current = window.setTimeout(() => {
        setReady(true);
      }, timeout);

      return () => window.clearTimeout(timerRef.current);
    }

    return noop;
  }, [ready, timeout]);

  return [throttledFunction, ready];
}

export { useThrottle };
