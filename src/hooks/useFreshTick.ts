import { useFreshRef } from "./useFreshRef";

type CallbackType<T> = (...args: T[]) => void;

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
