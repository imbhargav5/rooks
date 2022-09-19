import { useCallback, useMemo, useState } from "react";

type Push<T> = (...args: Parameters<Array<T>["push"]>) => void;
type Pop = () => void;
type Unshift<T> = (...args: Parameters<Array<T>["unshift"]>) => void;
type Shift = () => void;
type Reverse = () => void;
type Concat<T> = (value: T[]) => void;
type Fill<T> = (value: T, start?: number, end?: number) => void;
type UpdateItemAtIndex<T> = (index: number, value: T) => void;
type Clear = () => void;

export type UseArrayStateControls<T> = {
  push: Push<T>;
  pop: Pop;
  clear: Clear;
  unshift: Unshift<T>;
  shift: Shift;
  reverse: Reverse;
  concat: Concat<T>;
  fill: Fill<T>;
  updateItemAtIndex: UpdateItemAtIndex<T>;
};

export type UseArrayStateReturnValue<T> = [T[], UseArrayStateControls<T>];

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

  const push = useCallback<Push<T>>(
    (value) => {
      setArray([...array, value]);
    },
    [array]
  );

  const pop = useCallback<Pop>(() => {
    setArray(array.slice(0, array.length - 1));
  }, [array]);

  const clear = useCallback<Clear>(() => {
    setArray([]);
  }, []);

  const unshift = useCallback<Unshift<T>>(
    (value) => {
      setArray([value, ...array]);
    },
    [array]
  );

  const shift = useCallback<Shift>(() => {
    setArray(array.slice(1));
  }, [array]);

  const reverse = useCallback<Reverse>(() => {
    setArray([...array].reverse());
  }, [array]);

  const concat = useCallback<Concat<T>>(
    (value: T[]) => {
      setArray([...array, ...value]);
    },
    [array]
  );

  const fill = useCallback<Fill<T>>(
    (value: T, start?: number, end?: number) => {
      setArray([...array].fill(value, start, end));
    },
    [array]
  );

  const updateItemAtIndex = useCallback(
    (index: number, value: T) => {
      setArray((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = value;
        return newArray;
      });
    },
    [setArray]
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
      updateItemAtIndex,
    };
  }, [
    push,
    pop,
    clear,
    unshift,
    shift,
    reverse,
    concat,
    fill,
    updateItemAtIndex,
  ]);

  const returnValue = useMemo<UseArrayStateReturnValue<T>>(() => {
    return [array, controls];
  }, [array, controls]);

  return returnValue;
}

export { useArrayState };
