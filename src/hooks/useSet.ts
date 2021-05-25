import { useCallback, useMemo, useState } from 'react';

type StableActions<T> = {
  add: (key: T) => void;
  remove: (key: T) => void;
  toggle: (key: T) => void;
  reset: () => void;
};

type Actions<T> = StableActions<T> & {
  has: (key: T) => boolean;
};

/**
 * useSet hook
 * React state hook that tracks a Set.
 *
 * @param initialSet - initial set
 */
const useSet = <K>(initialSet = new Set<K>()): [Set<K>, Actions<K>] => {
  const [set, setSet] = useState(initialSet);

  // memoized actions
  const stableActions = useMemo<StableActions<K>>((): StableActions<K> => {
    const add = (item: K) => {
      setSet((previousSet) => new Set([...Array.from(previousSet), item]));
    };

    const remove = (item: K) => {
      setSet(
        (previousSet) =>
          new Set(Array.from(previousSet).filter((index) => index !== item))
      );
    };

    const toggle = (item: K) => {
      setSet((previousSet) => {
        if (previousSet.has(item))
          return new Set(
            Array.from(previousSet).filter((index) => index !== item)
          );

        return new Set([...Array.from(previousSet), item]);
      });
    };

    return { add, remove, reset: () => setSet(initialSet), toggle };
  }, [setSet, initialSet]);

  // utils included memoized actions
  const utils = {
    has: useCallback((item) => set.has(item), [set]),
    ...stableActions,
  } as Actions<K>;

  return [set, utils];
};

export { useSet };
