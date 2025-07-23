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
type SetArray<T> = (value: T[]) => void;
type Splice<T> = (...args: Parameters<Array<T>["splice"]>) => void;
type RemoveItemAtIndex = (index: number) => void;
type ReplaceItemAtIndex<T> = (index: number, value: T) => void;
type InsertItemAtIndex<T> = (index: number, value: T) => void;
type Sort<T> = (compareFn?: (a: T, b: T) => number) => void;

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
  setArray: SetArray<T>;
  splice: Splice<T>;
  removeItemAtIndex: RemoveItemAtIndex;
  replaceItemAtIndex: ReplaceItemAtIndex<T>;
  insertItemAtIndex: InsertItemAtIndex<T>;
  sort: Sort<T>;
};

export type UseArrayStateReturnValue<T> = [T[], UseArrayStateControls<T>];

/**
 * useArrayState
 * @description Array state manager hook for React
 * @param {Array<T>} initialState Initial state of the array
 * @returns {UseArrayStateReturnValue<T>} Array state manager hook for React
 * @see {@link https://rooks.vercel.app/docs/hooks/useArrayState}
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
 * controls.updateItemAtIndex(0, 1); // [1, 0, 0, 0, 0, 0]
 * controls.clear(); // []
 * controls.setArray([1, 2, 3]); // [1, 2, 3]
 * controls.splice(1, 1); // [1, 3]
 * controls.removeItemAtIndex(1); // [1]
 * controls.replaceItemAtIndex(0, 2); // [2]
 * controls.insertItemAtIndex(0, 1); // [1, 2]
 * controls.sort((a, b) => a - b); // [1, 2]
 *
 */
function useArrayState<T>(
  initial: T[] | (() => T[])
): UseArrayStateReturnValue<T> {
  const [array, setArray] = useState(initial ?? []);

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

  const splice = useCallback<Splice<T>>(
    (...args) => {
      setArray((prevArray) => {
        const newArray = [...prevArray];
        newArray.splice(...args);
        return newArray;
      });
    },
    [setArray]
  );

  const removeItemAtIndex = useCallback<RemoveItemAtIndex>(
    (index: number) => {
      setArray((prevArray) => {
        const newArray = [...prevArray];
        newArray.splice(index, 1);
        return newArray;
      });
    },
    [setArray]
  );

  const replaceItemAtIndex = useCallback<ReplaceItemAtIndex<T>>(
    (index: number, value: T) => {
      setArray((prevArray) => {
        const newArray = [...prevArray];
        newArray.splice(index, 1, value);
        return newArray;
      });
    },
    [setArray]
  );

  const insertItemAtIndex = useCallback<InsertItemAtIndex<T>>(
    (index: number, value: T) => {
      setArray((prevArray) => {
        const newArray = [...prevArray];
        newArray.splice(index, 0, value);
        return newArray;
      });
    },
    [setArray]
  );

  const sort = useCallback<Sort<T>>(
    (compareFn) => {
      setArray([...array].sort(compareFn));
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
      updateItemAtIndex,
      setArray,
      splice,
      removeItemAtIndex,
      replaceItemAtIndex,
      insertItemAtIndex,
      sort,
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
    setArray,
    splice,
    removeItemAtIndex,
    replaceItemAtIndex,
    insertItemAtIndex,
    sort,
  ]);

  const returnValue = useMemo<UseArrayStateReturnValue<T>>(() => {
    return [array, controls];
  }, [array, controls]);

  return returnValue;
}

export { useArrayState };
