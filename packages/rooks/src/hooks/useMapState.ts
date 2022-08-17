import { useCallback, useState } from "react";

type Key = string | number | symbol;
type MapState<K extends Key, V> = Record<K, V> | Map<K, V>;

type UseMapStateReturnValue<I> = [
  I,
  {
    has: (key: Key) => boolean;
    remove: (key: Key) => void;
    removeAll: () => void;
    removeMultiple: (...keys: Key[]) => void;
    set: (key: Key, value: unknown) => void;
    setMultiple: (next: Record<Key, unknown>) => void;
  }
];

/**
 * useMapState hook
 * A hook to manage state in the form of a map or object.
 *
 * @param initialValue Initial value of the map
 * @see https://react-hooks.org/docs/useMapState
 */
function useMapState<K extends Key, V, I extends MapState<K, V>>(
  initialValue: I = new Map() as I
): UseMapStateReturnValue<I> {
  const [map, setMap] = useState<MapState<K, V>>(initialValue);
  const set = useCallback((key: Key, value: unknown) => {
    setMap(currentMap => {
      if (currentMap instanceof Map) {
        return new Map<Key, unknown>(currentMap).set(key, value) as MapState<
          K,
          V
        >;
      } else {
        return {
          ...currentMap,
          [key]: value,
        };
      }
    });
  }, []);

  const has = useCallback(
    (key: Key) => {
      if (map instanceof Map) {
        return map.has(key as K);
      } else {
        return key in map;
      }
    },
    [map]
  );

  const setMultiple = useCallback((nextMap: Record<Key, unknown>) => {
    setMap(currentMap => {
      if (currentMap instanceof Map) {
        const newMap = new Map<Key, unknown>(currentMap);
        Object.keys(nextMap).forEach(key => {
          newMap.set(key, nextMap[key] as unknown);
        });
        return newMap as MapState<K, V>;
      } else {
        return {
          ...currentMap,
          ...nextMap,
        };
      }
    });
  }, []);

  const removeMultiple = useCallback(
    (...keys: Key[]) => {
      setMap(currentMap => {
        if (currentMap instanceof Map) {
          const newMap = new Map<Key, unknown>(currentMap);
          keys.forEach(key => {
            newMap.delete(key);
          });
          return newMap as MapState<K, V>;
        } else {
          const newMap = { ...currentMap };
          keys.forEach(key => {
            const key2 = key as keyof Partial<MapState<K, V>>;
            delete newMap[key2];
          });
          return newMap as MapState<K, V>;
        }
      });
    },
    [setMap]
  );

  const remove = useCallback(
    (key: Key) => {
      setMap(currentMap => {
        if (currentMap instanceof Map) {
          const map = new Map<Key, unknown>(currentMap);
          map.delete(key);
          return map as MapState<K, V>;
        } else {
          const newMap = { ...currentMap };
          const key2 = key as keyof Partial<MapState<K, V>>;
          delete newMap[key2];
          return newMap as MapState<K, V>;
        }
      });
    },
    [setMap]
  );

  const removeAll = useCallback(() => {
    setMap(currentMap => {
      if (currentMap instanceof Map) {
        return new Map<Key, unknown>() as MapState<K, V>;
      } else {
        return {} as MapState<K, V>;
      }
    });
  }, [setMap]);

  return [
    map,
    {
      has,
      remove,
      removeAll,
      removeMultiple,
      set,
      setMultiple,
    },
  ];
}

export { useMapState };
