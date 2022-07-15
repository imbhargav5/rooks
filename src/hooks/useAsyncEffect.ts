import React, { DependencyList, useEffect } from "react";

type Effect = (signal: AbortSignal) => Promise<void | CleanupFunction>;
type CleanupFunction = () => void;

/**
 *
 * @param effect
 * @param deps
 * @param cleanup
 */
function useAsyncEffect(effect: Effect, deps?: DependencyList) {
  useEffect(() => {
    const controller = new AbortController();

    effect(controller.signal).then((cleanupFunction) => {
      typeof cleanupFunction === "function" && cleanupFunction();
    });

    return () => controller.abort();
  }, deps);
}

export { useAsyncEffect };
