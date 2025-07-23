import { useRef, useEffect } from "react";
import { noop } from "@/utils/noop";

/**
 * A setInterval hook that calls a callback after a interval duration
 * when a condition is true
 *
 * @param callback The callback to be invoked after interval
 * @param intervalDurationMs Amount of time in ms after which to invoke
 * @param when The condition which when true, sets the interval
 * @param startImmediate If the callback should be invoked immediately
 * @see https://rooks.vercel.app/docs/hooks/useIntervalWhen
 */
function useIntervalWhen(
  callback: () => void,
  intervalDurationMs = 0,
  when = true,
  startImmediate = false
): void {
  const savedRefCallback = useRef<() => void | undefined>(undefined);

  useEffect(() => {
    savedRefCallback.current = callback;
  });

  useEffect(() => {
    if (when) {
      function internalCallback() {
        savedRefCallback.current?.();
      }

      if (startImmediate) {
        internalCallback();
      }

      const interval = window.setInterval(internalCallback, intervalDurationMs);

      return () => {
        window.clearInterval(interval);
      };
    }

    return noop;
  }, [when, intervalDurationMs, startImmediate]);
}

export { useIntervalWhen };
