import { useCallback, useState } from "react";

/**
 * useMapState hook
 * A hook to manage state in the form of a map or object.
 *
 * @param initialValue Initial value of the map
 * @see https://rooks.vercel.app/docs/hooks/useMapState
 */
function useMapState<
  T extends {
    [key: string]: unknown;
  },
  K extends keyof T
>(
  initialValue: T
): [
    T,
    {
      has: (key: K) => boolean;
      remove: (key: K) => void;
      removeAll: () => void;
      removeMultiple: (...keys: K[]) => void;
      set: (key: K, value: T[K]) => void;
      setMultiple: (next: Partial<T>) => void;
    }
  ] {
  const [map, setMap] = useState(initialValue);

  const set = useCallback((key: K, value: T[K]) => {
    setMap((currentMap) => ({
      ...currentMap,
      [key]: value,
    }));
  }, []);

  const has = useCallback(
    (key: K) => {
      return typeof map[key] !== "undefined";
    },
    [map]
  );

  const setMultiple = useCallback((nextMap: Partial<T>) => {
    setMap((currentMap) => ({
      ...currentMap,
      ...nextMap,
    }));
  }, []);

  const removeMultiple = useCallback(
    (...keys: K[]) => {
      setMap((currentMap) => {
        const nextMap = { ...currentMap };
        for (const key of keys) {

          delete nextMap[key];
        }

        return nextMap;
      });
    },
    [setMap]
  );

  const remove = useCallback(
    (key: K) => {
      setMap((currentMap) => {
        const nextMap = { ...currentMap };

        delete nextMap[key];

        return nextMap;
      });
    },
    [setMap]
  );

  const removeAll = useCallback(() => {
    setMap((currentMap) => {
      const nextMap = { ...currentMap };
      for (const key in nextMap) {
        // eslint-disable-next-line no-prototype-builtins
        if (nextMap.hasOwnProperty(key)) {

          delete nextMap[key];
        }
      }

      return nextMap;
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
