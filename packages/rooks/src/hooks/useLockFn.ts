/**
 * useLockFn
 * @description Wraps an async function to prevent concurrent calls (anti-double-submit).
 * While a call is in-flight, subsequent calls return undefined immediately without invoking fn.
 * Uses a ref for the lock flag — no extra re-renders triggered.
 * @see {@link https://rooks.vercel.app/docs/hooks/useLockFn}
 */
import { useCallback, useEffect, useRef } from "react";
import { useFreshRef } from "./useFreshRef";

/**
 * useLockFn
 *
 * @param fn Async function to wrap with a concurrency lock
 * @returns A wrapped async function with identical signature. While a call is in-flight,
 * subsequent calls return undefined immediately without invoking fn again.
 * @see https://rooks.vercel.app/docs/hooks/useLockFn
 * @example
 * ```jsx
 * function SubmitButton() {
 *   const handleSubmit = useLockFn(async () => {
 *     await fetch('/api/submit', { method: 'POST' });
 *   });
 *   return <button onClick={handleSubmit}>Submit</button>;
 * }
 * ```
 */
function useLockFn<TParams extends unknown[], TResult>(
  fn: (...args: TParams) => Promise<TResult>
): (...args: TParams) => Promise<TResult | undefined> {
  const lockRef = useRef<boolean>(false);
  const fnRef = useFreshRef(fn);

  useEffect(() => {
    return () => {
      lockRef.current = false;
    };
  }, []);

  return useCallback(
    async (...args: TParams): Promise<TResult | undefined> => {
      if (lockRef.current) {
        return undefined;
      }
      lockRef.current = true;
      try {
        return await fnRef.current(...args);
      } finally {
        lockRef.current = false;
      }
    },
    [fnRef]
  );
}

export { useLockFn };
