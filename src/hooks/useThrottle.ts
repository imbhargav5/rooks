import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useThrottle
 * Throttles a function with a timeout and ensures
 * that the callback function runs at most once in that duration
 *
 * @param fn The callback to throttle
 * @param timeout Throttle timeout
 */
function useThrottle(
  function_: Function,
  timeout: number = 300
): [(...args: any) => any, boolean] {
  const [ready, setReady] = useState(true);
  const timerRef = useRef<number | undefined>(undefined);

  if (!function_ || typeof function_ !== 'function') {
    throw new Error(
      'As a first argument, you need to pass a function to useThrottle hook.'
    );
  }

  const throttledFunction = useCallback(
    (...args) => {
      if (!ready) {
        return;
      }

      setReady(false);
      function_(...args);
    },
    [ready, function_]
  );

  useEffect(() => {
    if (!ready) {
      timerRef.current = window.setTimeout(() => {
        setReady(true);
      }, timeout);

      return () => window.clearTimeout(timerRef.current);
    }
  }, [ready, timeout]);

  return [throttledFunction, ready];
}

export { useThrottle };
