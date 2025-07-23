import { useCallback, useMemo, useState } from "react";

/**
 * useStackState
 * @description Manages a stack with react hooks.
 * @param initialList Initial value of the list
 * @returns The list and controls to modify the stack
 * @see https://rooks.vercel.app/docs/hooks/useStackState
 */
function useStackState<T>(initialList: T[]): [
  T[],
  {
    clear: () => void;
    isEmpty: () => boolean;
    length: number;
    peek: () => T | undefined;
    pop: () => T | undefined;
    push: (item: T) => number;
  },
  T[]
] {
  const [list, setList] = useState<T[]>([...initialList]);
  const length = list.length;

  const listInReverse = useMemo<T[]>(() => {
    const reverseList = [...list];
    reverseList.reverse();

    return reverseList;
  }, [list]);

  const push = useCallback(
    (item: T) => {
      const newList = [...list, item];
      setList(newList);

      return newList.length;
    },
    [list]
  );

  const pop = useCallback(() => {
    if (list.length > 0) {
      const lastItem = list[list.length - 1];
      setList([...list.slice(0, list.length - 1)]);

      return lastItem;
    }

    return undefined;
  }, [list]);

  const peek = useCallback(() => {
    if (list.length > 0) {
      return list[list.length - 1];
    }

    return undefined;
  }, [list]);

  const clear = () => setList([]);

  const isEmpty = useCallback(() => list.length === 0, [list]);

  const controls = {
    clear,
    isEmpty,
    length,
    peek,
    pop,
    push,
  };

  return [list, controls, listInReverse];
}

export { useStackState };
