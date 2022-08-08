import { UseArrayStateControls, UseArrayStateReturnValue } from "@/types/types";
import { useCallback, useMemo, useState } from "react";

/**
 * useArrayState
 * @description Array state manager hook for React
 * @param {Array<T>} initialState Initial state of the array
 * @returns {UseArrayStateReturnValue<T>} Array state manager hook for React
 * @see {@link https://react-hooks.org/docs/useArrayState}
 *
 * @example
 *
 * const [array, controls] = useArrayState([1, 2, 3]);
 *
 * controls.push(4); // [1, 2, 3, 4]
 * controls.pop(); // [1, 2, 3]
 * controls.unshift(0); // [0, 1, 2, 3]
 * controls.shift(); // [1, 2, 3]
 * controls.reverse(); // [3, 2, 1]
 * controls.concat([4, 5, 6]); // [3, 2, 1, 4, 5, 6]
 * controls.fill(0); // [0, 0, 0, 0, 0, 0]
 */
function useArrayState<T>(initialArray: T[] = []): UseArrayStateReturnValue<T> {
  const [array, setArray] = useState(initialArray);

  const push = useCallback(
    (value: T) => {
      setArray([...array, value]);
    },
    [array]
  );

  const pop = useCallback(() => {
    setArray(array.slice(0, array.length - 1));
  }, [array]);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const unshift = useCallback(
    (value: T) => {
      setArray([value, ...array]);
    },
    [array]
  );

  const shift = useCallback(() => {
    setArray(array.slice(1));
  }, [array]);

  const reverse = useCallback(() => {
    setArray([...array].reverse());
  }, [array]);

  const concat = useCallback(
    (value: T[]) => {
      setArray([...array, ...value]);
    },
    [array]
  );

  const fill = useCallback(
    (value: T, start?: number, end?: number) => {
      setArray([...array].fill(value, start, end));
    },
    [array]
  );

  const controls = useMemo<UseArrayStateControls<T>>(() => {
    return {
      push,
      pop,
      clear,
      unshift,
      shift,
      reverse,
      concat,
      fill,
    };
  }, [push, pop, clear, unshift, shift, reverse, concat, fill]);

  const returnValue = useMemo<UseArrayStateReturnValue<T>>(() => {
    return [array, controls];
  }, [array, controls]);

  return returnValue;
}

export { useArrayState };
