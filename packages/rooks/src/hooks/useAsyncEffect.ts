import { type DependencyList, useEffect, useRef, useCallback } from "react";
import { useFreshRef } from "./useFreshRef";
import { useGetIsMounted } from "./useGetIsMounted";

type Effect<T> = (shouldContinueEffect: () => boolean) => Promise<T>;
type CleanupFunction<T> = (result: T | void) => void;

/**
 * A version of useEffect that accepts an async function
 *
 * @param {Effect<T>} effect Async function that can return a cleanup function and takes in an AbortSignal
 * @param {DependencyList} deps If present, effect will only activate if the values in the list change
 * @param {CleanupFunction} cleanup The destroy/cleanup function. Will be called with previous result if it exists. 
 * @see https://rooks.vercel.app/docs/hooks/useAsyncEffect
 * @example 
 * ```jsx
 * useAsyncEffect(
        async (shouldContinueEffect) => {
          const data1 = await fetchData1(arg1, arg2);
          if(shouldContinueEffect()) {
            const data2 = await fetchData2(arg1, arg2);
          }          
          ...
        },
        [arg1, arg2],
        (previousResult) => {
          // ... do something with previousResult ...
        }
      );
 * ``` 
 */
function useAsyncEffect<T>(
  effect: Effect<T>,
  deps: DependencyList,
  cleanup?: CleanupFunction<T>
) {
  // We need to synchronize the async callback response with
  // the closure it was called in
  const lastCallId = useRef(0);
  const getIsMounted = useGetIsMounted();
  const effectRef = useFreshRef(effect);
  const callback = useCallback(async (): Promise<void | T> => {
    const callId = ++lastCallId.current;
    const shouldContinueEffect = () => {
      return getIsMounted() && callId === lastCallId.current;
    };
    try {
      return await effectRef.current(shouldContinueEffect);
    } catch (error) {
      throw error;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getIsMounted, ...deps]);

  useEffect(() => {
    let result: void | T;
    callback().then((value) => {
      result = value;
    });
    return () => {
      cleanup?.(result);
    };
  }, [callback, cleanup]);
}

export { useAsyncEffect };
