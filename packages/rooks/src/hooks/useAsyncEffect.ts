import React, { DependencyList, useEffect } from "react";

type Effect = (signal: AbortSignal) => Promise<void | CleanupFunction>;
type CleanupFunction = () => void;

/**
 * A version of useEffect that accepts an async function
 * @param effect Async function that can return a cleanup function and takes in an AbortSignal
 * @param deps If present, effect will only activate if the values in the list change
 */
function useAsyncEffect(effect: Effect, deps?: DependencyList) {
  useEffect(() => {
    const controller = new AbortController();

    const effectPromise = effect(controller.signal).catch(() => {
      console.error(
        "You should NEVER throw inside useAsyncEffect. This means the cleanup function will not run, which can cause unintended side effects. Please wrap your useAsyncEffect function in a try/catch."
      );
    });

    return () => {
      controller.abort();
      runCleanup();

      async function runCleanup() {
        const cleanupFunction = await effectPromise;
        if (cleanupFunction) {
          cleanupFunction();
        }
      }
    };
  }, deps);
}

export { useAsyncEffect };
