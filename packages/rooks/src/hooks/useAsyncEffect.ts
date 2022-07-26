import { type DependencyList, useEffect, useRef, useCallback } from "react";
import { useGetIsMounted } from "./useGetIsMounted";

type Effect = (signal: AbortSignal) => Promise<CleanupFunction | undefined>;
type CleanupFunction = () => void;

/**
 * A version of useEffect that accepts an async function
 *
 * @param effect Async function that can return a cleanup function and takes in an AbortSignal
 * @param deps If present, effect will only activate if the values in the list change
 */
function useAsyncEffect(effect: Effect, deps?: DependencyList) {
  const lastCallId = useRef(0);
  const getIsMounted = useGetIsMounted();

  const callback = useCallback(() => {
    const callId = ++lastCallId.current;
    const signal = new AbortSignal();
    effect(signal)
      .then((cleanup) => {
        if (getIsMounted() && callId === lastCallId.current) {
          signal.addEventListener("abort", () => {
            if (callId === lastCallId.current) {
              cleanup?.();
            }
          });
        }
      })
      .catch((error) => {
        if (getIsMounted() && callId === lastCallId.current) {
          throw error;
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, getIsMounted, deps]);

  useEffect(() => {
    callback();
  }, [callback]);
}

export { useAsyncEffect };
