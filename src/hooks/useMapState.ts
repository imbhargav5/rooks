import { useState } from 'react';

/**
 * useMapState hook
 * A hook to manage state in the form of a map or object.
 *
 * @param initialValue Initial value of the map
 */
function useMapState(
  initialValue: any
): [
  any,
  {
    set: (key: any, value: any) => void;
    has: (key: any) => boolean;
    setMultiple: (...keys: any[]) => void;
    remove: (key: any) => void;
    removeMultiple: (...keys: any[]) => void;
    removeAll: () => void;
  }
] {
  const [map, setMap] = useState(initialValue);

  function set(key: any, value: any) {
    setMap({
      ...map,
      [key]: value,
    });
  }
  function has(key: any) {
    return typeof map[key] !== 'undefined';
  }
  function setMultiple(object: { any: any }) {
    setMap({
      ...map,
      ...object,
    });
  }
  function removeMultiple(...keys) {
    const newMap = {};
    Object.keys(map).forEach((key) => {
      if (!keys.includes(key)) {
        newMap[key] = map[key];
      }
    });
    setMap(newMap);
  }
  function remove(key: any) {
    const newMap = {};
    Object.keys(map).forEach((mapKey) => {
      if (mapKey !== key) {
        newMap[mapKey] = map[mapKey];
      }
    });
    setMap(newMap);
  }
  function removeAll() {
    setMap({});
  }

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
