import { useState } from "react";

export type MapControls<K, V> = {
  set: (key: K, value: V) => void;
  setMultiple: (map: Map<K, V>) => void;
  remove: (key: K) => void;
  removeMultiple: (...keys: K[]) => void;
  removeAll: () => void;
};

/**
 * useMapState hook
 * A hook to manage state in the form of a map or object.
 *
 * @param initialValue Initial value of the map
 */
function useMapState<K, V>(
  initialValue: Map<K, V>
): [Map<K, V>, MapControls<K, V>] {
  const [map, setMap] = useState(initialValue);

  // Value of controls stays same every render
  const [controls] = useState<MapControls<K, V>>(() => ({
    remove: (keyToRemove) =>
      setMap(
        (currentMap) =>
          new Map([...currentMap].filter(([key]) => key !== keyToRemove))
      ),
    removeAll: () => setMap(new Map()),
    removeMultiple: (...keys) =>
      setMap(
        (currentMap) =>
          new Map([...currentMap].filter(([key]) => !keys.includes(key)))
      ),
    set: (key, value) =>
      setMap((currentMap) => new Map([...currentMap, [key, value]])),
    setMultiple: (additionalMap) =>
      setMap((currentMap) => new Map([...currentMap, ...additionalMap])),
  }));

  return [map, controls];
}

export { useMapState };
