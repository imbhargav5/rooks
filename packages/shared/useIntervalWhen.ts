import { useRef, useEffect } from "react";


/**
 * A setInterval hook that calls a callback after a interval duration
 * when a condition is true
 * @param cb The callback to be invoked after interval
 * @param intervalDurationMs Amount of time in ms after which to invoke
 * @param when The condition which when true, sets the interval
 */
function useIntervalWhen(
  cb: () => void,
  intervalDurationMs: number = 0,
  when: boolean = true
): void {
  const savedRefCallback = useRef<() => any>();

  useEffect(() => {
    savedRefCallback.current = cb;
  });

  function callback() {
    savedRefCallback.current && savedRefCallback.current();
  }


  useEffect(() => {
    if (when) {
      const interval = window.setInterval(callback, intervalDurationMs);
      return () => {
        window.clearInterval(interval);
      };
    }
  }, [when, intervalDurationMs]);

}

export { useIntervalWhen };
