import { useCallback, useState } from "react";

type Actions<T> = {
  has: (key: T) => boolean;
  add: (keys: T) => void;
  remove: (keys: T) => void;
  removeAll: () => void;
};

/**
 * useSet hook
 *
 * A React hook that tracks state in the form of a Set data structure.
 *
 * @param initialSet - initial set
 */
const useSet = <K>(initialSet = new Set<K>()): [Set<K>, Actions<K>] => {
  const [set, setSet] = useState(initialSet);

  const add = (...items: K[]) => {
    setSet((previousSet) => new Set([...Array.from(previousSet), ...items]));
  };

  const remove = (...items: K[]) => {
    setSet(
      (previousSet) =>
        new Set(Array.from(previousSet).filter((key) => !items.includes(key)))
    );
  };

  const removeAll = () => setSet(initialSet);

  const utils = {
    add,
    has: useCallback((item) => set.has(item), [set]),
    remove,
    removeAll,
  } as Actions<K>;

  return [set, utils];
};

export { useSet };
