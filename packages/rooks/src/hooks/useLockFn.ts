/**
 * useLockFn
 * @description Wraps an async function to prevent concurrent execution (anti-double-submit pattern)
 * @see {@link https://rooks.vercel.app/docs/hooks/useLockFn}
 */
import { useCallback, useRef, useState } from "react";
import { useFreshCallback } from "./useFreshCallback";

type AnyAsyncFunction = (...args: unknown[]) => Promise<unknown>;

/**
 * useLockFn
 *
 * @param fn Async function to wrap with a lock
 * @returns A tuple of [lockedFn, isLocked] where lockedFn is the wrapped function
 * that will not execute if a call is already in progress, and isLocked is a boolean
 * indicating whether the function is currently running.
 * @see https://rooks.vercel.app/docs/hooks/useLockFn
 */
function useLockFn<F extends AnyAsyncFunction>(
  fn: F
): [(...args: Parameters<F>) => Promise<void>, boolean] {
  const [isLocked, setIsLocked] = useState(false);
  const lockRef = useRef(false);
  const freshFn = useFreshCallback(fn);

  const lockedFn = useCallback(
    async (...args: Parameters<F>) => {
      if (lockRef.current) return;
      lockRef.current = true;
      setIsLocked(true);
      try {
        await freshFn(...args);
      } finally {
        lockRef.current = false;
        setIsLocked(false);
      }
    },
    [freshFn]
  );

  return [lockedFn as (...args: Parameters<F>) => Promise<void>, isLocked];
}

export { useLockFn };
