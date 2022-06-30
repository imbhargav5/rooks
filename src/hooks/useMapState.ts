import { useCallback, useState } from "react";

/**
 * useMapState hook
 * A hook to manage state in the form of a map or object.
 *
 * @param initialValue Initial value of the map
 */
function useMapState(initialValue: any): [
  any,
  {
    has: (key: any) => boolean;
    remove: (key: any) => void;
    removeAll: () => void;
    removeMultiple: (...keys: any[]) => void;
    set: (key: any, value: any) => void;
    setMultiple: (...keys: any[]) => void;
  }
] {
  const [map, setMap] = useState(initialValue);

  const set = useCallback((key: any, value: any) => {
    setMap((currentMap) => ({
      ...currentMap,
      [key]: value,
    }));
  }, []);

  const has = useCallback(
    (key: any) => {
      return typeof map[key] !== "undefined";
    },
    [map]
  );

  const setMultiple = useCallback((object: { any: any }) => {
    setMap((currentMap) => ({
      ...currentMap,
      ...object,
    }));
  }, []);

  const removeMultiple = useCallback((...keys) => {
    setMap((currentMap) => {
      const newMap = {};
      for (const key of Object.keys(currentMap)) {
        if (!keys.includes(key)) {
          newMap[key] = currentMap[key];
        }
      }

      return newMap;
    });
  }, []);

  const remove = useCallback((key: any) => {
    setMap((currentMap) => {
      const newMap = {};
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

  const controls = {
    has,
    remove,
    removeAll,
    removeMultiple,
    set,
    setMultiple,
  };

  return [map, controls];
}

export { useMapState };
