/**
 * useFreshCallback
 * @description Avoid stale closures and keep your callback fresh
 * @see {@link https://rooks.vercel.app/docs/hooks/useFreshCallback}
 */
import { useCallback } from "react";
import { useFreshRef } from "./useFreshRef";

type LegacyCallbackType<T, R> = (...args: T[]) => R;
type CallbackType<Args extends unknown[], R> = (...args: Args) => R;

/**
 * useFreshCallback
 * @param callback Any callback function
 * @returns A fresh callback.
 * @see https://rooks.vercel.app/docs/hooks/useFreshCallback
 */
function useFreshCallback<T, R = void>(
  callback: LegacyCallbackType<T, R>
): LegacyCallbackType<T, R>;
function useFreshCallback<Args extends unknown[], R = void>(
  callback: CallbackType<Args, R>
): CallbackType<Args, R>;
function useFreshCallback(
  callback: (...args: any[]) => any
): (...args: any[]) => any {
  const freshRef = useFreshRef(callback);
  const tick = useCallback(
    (...args: any[]) => {
      return freshRef.current(...args);
    },
    [freshRef]
  );

  return tick;
}

export { useFreshCallback };
