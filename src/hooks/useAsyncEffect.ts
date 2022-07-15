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

    effect(controller.signal)
      .then((cleanupFunction) => {
        typeof cleanupFunction === "function" && cleanupFunction();
      })
      .catch(() => {
        console.error(
          "You should NEVER throw inside useAsyncEffect. This means the cleanup function will not run, which can cause unintended side effects. Please wrap your useAsyncEffect function in a try/catch."
        );
      });

    return () => controller.abort();
  }, deps);
}

export { useAsyncEffect };
