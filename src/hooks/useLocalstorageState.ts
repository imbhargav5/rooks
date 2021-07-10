import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect, useCallback, useRef } from "react";

function getValueFromLocalStorage(key) {
  if (typeof localStorage === "undefined") {
    return null;
  }
  const storedValue = localStorage.getItem(key) || "null";
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(error);
  }

  return storedValue;
}

function saveValueToLocalStorage(key: string, value: any) {
  if (typeof localStorage === "undefined") {
    return null;
  }

  return localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param key Key of the localStorage object
 * @param initialState Default initial value
 */
function initialize(key, initialState) {
  const valueLoadedFromLocalStorage = getValueFromLocalStorage(key);
  if (valueLoadedFromLocalStorage === null) {
    return initialState;
  } else {
    return valueLoadedFromLocalStorage;
  }
}

/**
 * useLocalstorageState hook
 * Tracks a value within localStorage and updates it
 *
 * @param {string} key - Key of the localStorage object
 * @param {any} initialState - Default initial value
 */
function useLocalstorageState<S>(
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
      saveValueToLocalStorage(key, value);
    }
  }, [value]);

  const listen = useCallback((e: StorageEvent) => {
    if (e.storageArea === localStorage && e.key === key) {
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
  }, []);

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
    localStorage.removeItem(key);
  }, []);

  return [value, setValue, remove];
}

export { useLocalstorageState };
