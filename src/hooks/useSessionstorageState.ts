import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect, useCallback, useRef } from "react";

function getValueFromSessionStorage(key) {
  if (typeof sessionStorage === "undefined") {
    return null;
  }
  const storedValue = sessionStorage.getItem(key) || "null";
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(error);
  }

  return storedValue;
}

function saveValueToSessionStorage(key: string, value: any) {
  if (typeof sessionStorage === "undefined") {
    return null;
  }

  return sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param key Key of the sessionStorage object
 * @param initialState Default initial value
 */
function initialize(key, initialState) {
  const valueLoadedFromSessionStorage = getValueFromSessionStorage(key);
  if (valueLoadedFromSessionStorage === null) {
    return initialState;
  } else {
    return valueLoadedFromSessionStorage;
  }
}

/**
 * useSessionstorageState hook
 * Tracks a value within sessionStorage and updates it
 *
 * @param {string} key - Key of the sessionStorage object
 * @param {any} initialState - Default initial value
 */
function useSessionstorageState<S>(
  key: string,
  initialState?: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, () => void] {
  const [value, __setValue] = useState(() => initialize(key, initialState));
  const isUpdateFromListener = useRef(false);

  useEffect(() => {
    /**
     * We need to ensure there is no loop of
     * storage events fired. Hence we are using a ref
     * to keep track of whether setValue is from another
     * storage event
     */
    if (!isUpdateFromListener.current) {
      saveValueToSessionStorage(key, value);
    }
  }, [value]);

  const listen = useCallback(
    (e: StorageEvent) => {
      if (e.storageArea === sessionStorage && e.key === key) {
        try {
          isUpdateFromListener.current = true;
          const newValue = JSON.parse(e.newValue || "null");
          if (value !== newValue) {
            __setValue(newValue);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [value]
  );

  // check for changes across windows
  useEffect(() => {
    window.addEventListener("storage", listen);

    return () => {
      window.removeEventListener("storage", listen);
    };
  }, []);

  const setValue = useCallback((newValue: S) => {
    isUpdateFromListener.current = false;
    __setValue(newValue);
  }, []);

  const remove = useCallback(() => {
    sessionStorage.removeItem(key);
  }, []);

  return [value, setValue, remove];
}

export { useSessionstorageState };
