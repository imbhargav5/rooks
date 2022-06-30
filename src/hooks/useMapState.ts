import { useCallback, useState } from "react";

/**
 * useMapState hook
 * A hook to manage state in the form of a map or object.
 *
 * @param initialValue Initial value of the map
 */
function useMapState<T>(initialValue: T): [
  T,
  {
    has: (key: keyof T) => boolean;
    remove: (key: keyof T) => void;
    removeAll: () => void;
    removeMultiple: (...keys: Array<keyof T>) => void;
    set: (key: keyof T, value: any) => void;
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

  const removeMultiple = useCallback((...keys) => {
    setMap((currentMap) => {
      const newMap: T = {};
      for (const key of Object.keys(currentMap)) {
        if (!keys.includes(key)) {
          newMap[key] = currentMap[key];
        }
      }

      return newMap;
    });
  }, []);

  const remove = useCallback((key: keyof T) => {
    setMap((currentMap) => {
      const newMap: T = {};
      for (const mapKey of Object.keys(currentMap)) {
        if (mapKey !== key) {
          newMap[mapKey] = currentMap[mapKey];
        }
      }

      return newMap;
    });
  }, []);

  const removeAll = useCallback(() => {
    setMap({});
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
