import { useFreshRef } from "./useFreshRef";

const useFreshTick = <T extends unknown[], U extends (...args: T) => void>(
  // eslint-disable-next-line promise/prefer-await-to-callbacks
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
