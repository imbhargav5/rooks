import { useFreshRef } from "./useFreshRef";

// eslint-disable-next-line promise/prefer-await-to-callbacks
const useFreshTick = <T extends unknown[], U extends (...args: T) => void>(
  callback: U
) => {
  const freshRef = useFreshRef<U>(callback);
  const tick = (...args: T) => {
    if (freshRef && typeof freshRef.current === "function") {
      freshRef.current(...args);
    }
  };

  return tick;
};

export { useFreshTick };
