import { useState, useEffect, useCallback, useRef } from "react";

function useThrottle(fn: Function, timeout: number = 300) {
  const [ready, setReady] = useState(true);
  const timerRef = useRef<number | undefined>(undefined);

  if (!fn || typeof fn !== "function") {
    throw new Error(
      "As a first argument, you need to pass a function to useThrottle hook."
    );
  }

  const throttledFn = useCallback(
    (...args) => {
      if (!ready) {
        return;
      }

      setReady(false);
      fn(...args);
    },
    [ready, fn]
  );

  useEffect(() => {
    if (!ready) {
      timerRef.current = window.setTimeout(() => {
        setReady(true);
      }, timeout);
      return () => window.clearTimeout(timerRef.current);
    }
  }, [ready, timeout]);
  return [throttledFn, ready];
}

export { useThrottle };
