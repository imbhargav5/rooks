import React, { DependencyList, useEffect } from "react";

type Effect = (signal: AbortSignal) => Promise<void | CleanupFunction>;
type CleanupFunction = () => void;

/**
 *
 * @param effect
 * @param deps
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
