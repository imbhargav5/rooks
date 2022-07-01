import { useCallback, useState } from "react";

/**
 * useMapState hook
 * A hook to manage state in the form of a map or object.
 *
 * @param initialValue Initial value of the map
 */
function useMapState<T, K extends keyof T>(
  initialValue: T
): [
  T,
  {
    has: (key: K) => boolean;
    remove: (key: K) => void;
    removeAll: () => void;
    removeMultiple: (...keys: K[]) => void;
    set: (key: K, value: any) => void;
    setMultiple: (next: Partial<T>) => void;
  }
] {
  const [map, setMap] = useState(initialValue);

  const set = useCallback((key: keyof T, value: any) => {
    setMap((currentMap) => ({
      ...currentMap,
      [key]: value,
    }));
  }, []);

  const has = useCallback(
    (key: keyof T) => {
      return typeof map[key] !== "undefined";
    },
    [map]
  );

  const setMultiple = useCallback((nextMap: { [K in keyof T]: any }) => {
    setMap((currentMap) => ({
      ...currentMap,
      ...nextMap,
    }));
  }, []);

  const removeMultiple = useCallback((...keys: Array<keyof T>) => {
    setMap((currentMap) => {
      const newMap = {} as T;
      for (const key of Object.keys(currentMap)) {
        if (!keys.includes(key as keyof T)) {
          newMap[key] = currentMap[key];
        }
      }

      return newMap;
    });
  }, []);

  const remove = useCallback((key: keyof T) => {
    setMap((currentMap) => {
      const newMap = {} as T;
      for (const mapKey of Object.keys(currentMap)) {
        if (mapKey !== key) {
          newMap[mapKey] = currentMap[mapKey];
        }
      }

      return newMap;
    });
  }, []);

  const removeAll = useCallback(() => {
    setMap({} as T);
  }, []);

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
