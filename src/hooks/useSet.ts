import { useCallback, useMemo, useState } from 'react';

export type StableActions<K> = {
  add: (key: K) => void;
  remove: (key: K) => void;
  toggle: (key: K) => void;
  reset: () => void;
};

export type Actions<K> = StableActions<K> & {
  has: (key: K) => boolean;
};

const useSet = <K>(initialSet = new Set<K>()): [Set<K>, Actions<K>] => {
  const [set, setSet] = useState(initialSet);

  const stableActions = useMemo<StableActions<K>>(() => {
    const add = (item: K) =>
      setSet((previousSet) => new Set([...Array.from(previousSet), item]));

    const remove = (item: K) =>
      setSet(
        (previousSet) =>
          new Set(Array.from(previousSet).filter((index) => index !== item))
      );

    const toggle = (item: K) =>
      // eslint-disable-next-line no-confusing-arrow
      setSet((previousSet) =>
        previousSet.has(item)
          ? new Set(Array.from(previousSet).filter((index) => index !== item))
          : new Set([...Array.from(previousSet), item])
      );

    const reset = () => setSet(initialSet);

    return { add, remove, reset, toggle };
  }, [setSet]);

  const utils = {
    has: useCallback((item) => set.has(item), [set]),
    ...stableActions,
  } as Actions<K>;

  return [set, utils];
};

export { useSet };
