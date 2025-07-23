/**
 * useNativeMapState
 * @description Manage Map() object state in React
 * @see {@link https://rooks.vercel.app/docs/hooks/useNativeMapState}
 */
import { useState, useCallback } from "react";

type MapControls<K, V> = {
  set: (key: K, value: V) => void;
  remove: (key: K) => void;
  clear: () => void;
  has: (key: K) => boolean;
  get: (key: K) => V | undefined;
  size: () => number;
  setMultiple: (entries: [K, V][]) => void;
  removeMultiple: (keys: K[]) => void;
  hasSome: (keys: K[]) => boolean;
  hasEvery: (keys: K[]) => boolean;
};

function useNativeMapState<K, V>(
  initialMapState?: Map<K, V>
): [ReadonlyMap<K, V>, MapControls<K, V>] {
  const [map, setMap] = useState<Map<K, V>>(initialMapState || new Map<K, V>());

  const set = useCallback((key: K, value: V) => {
    setMap((prevMap) => new Map(prevMap.set(key, value)));
  }, []);

  const setMultiple = useCallback((entries: [K, V][]) => {
    setMap((prevMap) => {
      const newMap = new Map(prevMap);
      entries.forEach(([key, value]) => {
        newMap.set(key, value);
      });
      return newMap;
    });
  }, []);

  const remove = useCallback((key: K) => {
    setMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const removeMultiple = useCallback((keys: K[]) => {
    setMap((prevMap) => {
      const newMap = new Map(prevMap);
      keys.forEach((key) => {
        newMap.delete(key);
      });
      return newMap;
    });
  }, []);

  const clear = useCallback(() => {
    setMap(new Map());
  }, []);

  const has = useCallback(
    (key: K) => {
      return map.has(key);
    },
    [map]
  );

  const hasSome = useCallback(
    (keys: K[]) => {
      return keys.some((key) => map.has(key));
    },
    [map]
  );

  const hasEvery = useCallback(
    (keys: K[]) => {
      return keys.every((key) => map.has(key));
    },
    [map]
  );

  const get = useCallback(
    (key: K) => {
      return map.get(key);
    },
    [map]
  );

  const size = useCallback(() => {
    return map.size;
  }, [map]);

  const controls: MapControls<K, V> = {
    set,
    remove,
    clear,
    has,
    get,
    size,
    setMultiple,
    removeMultiple,
    hasSome,
    hasEvery,
  };

  return [map, controls];
}

export { useNativeMapState };
