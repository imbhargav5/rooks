import { useState, useMemo } from "react";

export type MapControls<K, V> = Omit<Omit<Map<K, V>, "delete">, "set"> & {
  setMultiple: (additionalMap: Map<K, V>) => void;
  delete: (key: K) => void;
  deleteMultiple: (...keys: K[]) => void;
  set: (key: K, value: V) => void;
};

/**
 * useMapState hook
 * A hook to manage state in the form of a map or object.
 *
 * @param initialValue Initial value of the map
 */
function useMapState<K, V>(initialValue: Map<K, V>): MapControls<K, V> {
  const [map, setMap] = useState(initialValue);

  return useMemo<MapControls<K, V>>(
    () => ({
      clear: () => setMap(new Map()),
      delete: (keyToRemove) =>
        setMap(
          (currentMap) =>
            new Map([...currentMap].filter(([key]) => key !== keyToRemove))
        ),
      deleteMultiple: (...keys) =>
        setMap(
          (currentMap) =>
            new Map([...currentMap].filter(([key]) => !keys.includes(key)))
        ),
      entries: () => map.entries(),
      forEach: (...args) => map.forEach(...args),
      get: (...args) => map.get(...args),
      has: (...args) => map.has(...args),
      keys: () => map.keys(),
      set: (key, value) =>
        setMap((currentMap) => new Map([...currentMap, [key, value]])),
      setMultiple: (additionalMap) =>
        setMap((currentMap) => new Map([...currentMap, ...additionalMap])),
      // eslint-disable-next-line fp/no-get-set
      get size() {
        return map.size;
      },
      values: () => map.values(),
      [Symbol.iterator]: () => map[Symbol.iterator](),
      [Symbol.toStringTag]: map[Symbol.toStringTag],
    }),
    [map]
  );
}

export { useMapState };
