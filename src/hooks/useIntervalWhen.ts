import { useRef, useEffect } from "react";

/**
 * A setInterval hook that calls a callback after a interval duration
 * when a condition is true
 *
 * @param cb The callback to be invoked after interval
 * @param intervalDurationMs Amount of time in ms after which to invoke
 * @param when The condition which when true, sets the interval
 * @param startImmediate If the callback should be invoked immediately
 */
function useIntervalWhen(
  callback_: () => void,
  intervalDurationMs: number = 0,
  when: boolean = true,
  startImmediate: boolean = false
): void {
  const savedRefCallback = useRef<() => any>();

  useEffect(() => {
    savedRefCallback.current = callback_;
  });

  function callback() {
    savedRefCallback.current && savedRefCallback.current();
  }

  useEffect(() => {
    if (when) {
      if (startImmediate) {
        callback();
      }
      const interval = window.setInterval(callback, intervalDurationMs);

      return () => {
        window.clearInterval(interval);
      };
    }
  }, [when, intervalDurationMs]);
}

export { useIntervalWhen };
