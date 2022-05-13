import { useState, useRef, useEffect, useCallback } from "react";
import { useWarningOnMountInDevelopment } from "./useWarningOnMountInDevelopment";

type UseTimeoutHandler = {
  start: () => any;
  clear: () => any;
  stop: () => any;
  isActive: boolean;
};

/**
 * A setTimeout hook that calls a callback after a timeout duration
 *
 * @param cb The callback to be invoked after timeout
 * @param timeoutDelayMs Amount of time in ms after which to invoke
 */
function useTimeout(
  callback_: () => void,
  timeoutDelayMs: number = 0
): UseTimeoutHandler {
  useWarningOnMountInDevelopment(
    "useTimeout is deprecated, it will be removed in rooks v7. Please use useTimeoutWhen instead."
  );
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const savedRefCallback = useRef<() => any>();

  useEffect(() => {
    savedRefCallback.current = callback_;
  }, [callback_]);

  function callback() {
    savedRefCallback.current && savedRefCallback.current();
    clear();
  }

  const clear = useCallback(() => {
    setIsTimeoutActive(false);
  }, []);

  const start = useCallback(() => {
    setIsTimeoutActive(true);
  }, []);

  useEffect(() => {
    if (isTimeoutActive) {
      if (typeof window !== "undefined") {
        const timeout = window.setTimeout(callback, timeoutDelayMs);

        return () => {
          window.clearTimeout(timeout);
        };
      } else {
        console.warn("useTimeout: window is undefined.");
      }
    }
  }, [isTimeoutActive, timeoutDelayMs]);

  return {
    clear,
    isActive: isTimeoutActive,
    start,
    stop: clear,
  };
}

export { useTimeout };
