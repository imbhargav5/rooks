import { useEffect } from "react";
import { noop } from "@/utils/noop";
import { useFreshCallback } from "./useFreshCallback";

/**
 * A setTimeout hook that calls a callback after a timeout duration
 * when a condition is true
 *
 * @param callback The callback to be invoked after timeout
 * @param timeoutDelayMs Amount of time in ms after which to invoke
 * @param when The condition which when true, sets the timeout
 * @see https://rooks.vercel.app/docs/hooks/useTimeoutWhen
 */
function useTimeoutWhen(
  callback: () => void,
  timeoutDelayMs = 0,
  when = true,
  key: string | number = 0
): void {
  const freshCallback = useFreshCallback(callback);

  useEffect(() => {
    if (when) {
      function internalCallback() {
        freshCallback();
      }
       
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
  }, [timeoutDelayMs, when, key, freshCallback]);
}

export { useTimeoutWhen };
