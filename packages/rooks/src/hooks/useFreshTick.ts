import { useFreshRef } from "./useFreshRef";

type CallbackType<T> = (...args: T[]) => void;
/**
 * useFreshTick
 * @param callback The callback to be called on mount
 * @returns A fresh callback.
 * @see https://rooks.vercel.app/docs/hooks/useFreshCallback
 */
function useFreshTick<T>(callback: CallbackType<T>): CallbackType<T> {
  const freshRef = useFreshRef(callback);
  function tick(...args: T[]) {
    if (typeof freshRef.current === "function") {
      freshRef.current(...args);
    }
  }

  return tick;
}

export { useFreshTick };
