/**
 * useFreshCallback
 * @description Avoid stale closures and keep your callback fresh
 * @see {@link https://rooks.vercel.app/docs/hooks/useFreshCallback}
 */
import { useCallback } from "react";
import { useFreshRef } from "./useFreshRef";

type CallbackType<T, R> = (...args: T[]) => R;

/**
 * useFreshCallback
 * @param callback Any callback function
 * @returns A fresh callback.
 * @see https://rooks.vercel.app/docs/hooks/useFreshCallback
 */
function useFreshCallback<T, R = void>(
  callback: CallbackType<T, R>
): CallbackType<T, R> {
  const freshRef = useFreshRef(callback);
  const tick = useCallback<(...args: T[]) => R>(
    (...args) => {
      return freshRef.current(...args);
    },
    [freshRef]
  );

  return tick;
}

export { useFreshCallback };
