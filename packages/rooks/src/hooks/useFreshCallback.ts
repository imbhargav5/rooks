/**
 * useFreshCallback
 * @description Avoid stale closures and keep your callback fresh
 * @see {@link https://rooks.vercel.app/docs/useFreshCallback}
 */
import { useCallback } from "react";
import { useFreshRef } from "./useFreshRef";

type CallbackType<T> = (...args: T[]) => void;
/**
 * useFreshCallback
 * @param callback Any callback function
 * @returns A fresh callback.
 * @see https://rooks.vercel.app/docs/useFreshCallback
 */
function useFreshCallback<T>(callback: CallbackType<T>): CallbackType<T> {
  const freshRef = useFreshRef(callback);
  const tick = useCallback(
    (...args: T[]) => {
      if (typeof freshRef.current === "function") {
        freshRef.current(...args);
      }
    },
    [freshRef]
  );

  return tick;
}

export { useFreshCallback };
