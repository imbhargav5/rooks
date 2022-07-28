import { useState, useRef, useEffect, useCallback } from "react";
import { useWarningOnMountInDevelopment } from "./useWarningOnMountInDevelopment";
import { noop } from "@/utils/noop";

type UseTimeoutHandler = {
  clear: () => void;
  isActive: boolean;
  start: () => void;
  stop: () => void;
};

/**
 * A setTimeout hook that calls a callback after a timeout duration
 *
 * @param callback The callback to be invoked after timeout
 * @param timeoutDelayMs Amount of time in ms after which to invoke
 */
function useTimeout(
  callback: () => void,
  timeoutDelayMs: number = 0
): UseTimeoutHandler {
  useWarningOnMountInDevelopment(
    "useTimeout is deprecated, it will be removed in rooks v7. Please use useTimeoutWhen instead."
  );
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const savedRefCallback = useRef<() => void>();

  useEffect(() => {
    savedRefCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    setIsTimeoutActive(false);
  }, []);

  const start = useCallback(() => {
    setIsTimeoutActive(true);
  }, []);

  const internalCallback = useCallback(() => {
    savedRefCallback.current?.();
    clear();
  }, [clear]);

  useEffect(() => {
    if (isTimeoutActive) {
      // eslint-disable-next-line no-negated-condition
      if (typeof window !== "undefined") {
        const timeout = window.setTimeout(internalCallback, timeoutDelayMs);

        return () => {
          window.clearTimeout(timeout);
        };
      } else {
        console.warn("useTimeout: window is undefined.");
      }
    }

    return noop;
  }, [internalCallback, isTimeoutActive, timeoutDelayMs]);

  return {
    clear,
    isActive: isTimeoutActive,
    start,
    stop: clear,
  };
}

export { useTimeout };
