import { useRef, useEffect } from "react";
import { noop } from "@/utils/noop";

/**
 * A setTimeout hook that calls a callback after a timeout duration
 * when a condition is true
 *
 * @param callback The callback to be invoked after timeout
 * @param timeoutDelayMs Amount of time in ms after which to invoke
 * @param when The condition which when true, sets the timeout
 * @see {@link https://react-hooks.org/docs/useTimeout}
 */
function useTimeoutWhen(
  callback: () => void,
  timeoutDelayMs: number = 0,
  when: boolean = true
): void {
  const savedRefCallback = useRef<() => void>();

  useEffect(() => {
    savedRefCallback.current = callback;
  });

  function internalCallback() {
    savedRefCallback.current?.();
  }

  useEffect(() => {
    if (when) {
      // eslint-disable-next-line no-negated-condition
      if (typeof window !== "undefined") {
        const timeout = window.setTimeout(internalCallback, timeoutDelayMs);

        return () => {
          window.clearTimeout(timeout);
        };
      } else {
        console.warn("useTimeoutWhen: window is undefined.");
      }
    }

    return noop;
  }, [timeoutDelayMs, when]);
}

export { useTimeoutWhen };
