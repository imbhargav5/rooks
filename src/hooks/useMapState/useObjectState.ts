import { useCallback, useState } from "react";

export type UseObjectStateResult = [
  object,
  {
    set: (key: any, value: any) => void;
    has: (key: any) => boolean;
    setMultiple: (...keys: any[]) => void;
    remove: (key: any) => void;
    removeMultiple: (...keys: any[]) => void;
    removeAll: () => void;
  }
];

/**
 * useMapState hook
 * A hook to manage state in the form of a map or object.
 *
 * @param initialValue Initial value of the map
 */
function useObjectState(initialValue: object): UseObjectStateResult {
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
      Object.keys(currentMap).forEach((key) => {
        if (!keys.includes(key)) {
          newMap[key] = currentMap[key];
        }
      });

      return newMap;
    });
  }, []);

  const remove = useCallback((key: any) => {
    setMap((currentMap) => {
      const newMap = {};
      Object.keys(currentMap).forEach((mapKey) => {
        if (mapKey !== key) {
          newMap[mapKey] = currentMap[mapKey];
        }
      });

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

export { useObjectState };
