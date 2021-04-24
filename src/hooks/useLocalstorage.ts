import { useState, useEffect, useCallback } from 'react';

type StorageHandlerAsObject = {
  value: any;
  set: (newValue: any) => void;
  remove: () => void;
};

type StorageHandlerAsArray = any[] & {
  0: any;
  1: (newValue: any) => void;
  2: () => void;
};

type StorageHandler = StorageHandlerAsArray & {};
type StorageHandler = {} & StorageHandlerAsObject;

/**
 * useLocalstorage hook
 * Tracks a value within localStorage and updates it
 *
 * @param {string} key - Key of the localStorage object
 * @param {any} defaultValue - Default initial value
 */
function useLocalstorage(
  key: string,
  defaultValue: any = null
): StorageHandler {
  const [value, setValue] = useState(getValueFromLocalStorage());

  function init() {
    const valueLoadedFromLocalStorage = getValueFromLocalStorage();
    if (
      valueLoadedFromLocalStorage === null ||
      valueLoadedFromLocalStorage === 'null'
    ) {
      set(defaultValue);
    }
  }

  function getValueFromLocalStorage() {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const storedValue = localStorage.getItem(key) || 'null';
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      console.error(error);
    }

    return storedValue;
  }

  function saveValueToLocalStorage(key: string, value: any) {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.setItem(key, JSON.stringify(value));
  }

  function set(newValue: any) {
    setValue(newValue);
    saveValueToLocalStorage(key, newValue);
  }

  const listen = useCallback((e: StorageEvent) => {
    if (e.storageArea === localStorage && e.key === key) {
      setValue(e.newValue);
    }
  }, []);

  function remove() {
    set(null);
    if (typeof localStorage === 'undefined') {
      return false;
    }
    localStorage.removeItem(key);
  }

  // initialize
  useEffect(() => {
    init();
  }, []);

  // check for changes across windows
  useEffect(() => {
    window.addEventListener('storage', listen);

    return () => {
      window.removeEventListener('storage', listen);
    };
  }, []);
  let handler: unknown;

  (handler as StorageHandlerAsArray) = [value, set, remove];
  (handler as StorageHandlerAsObject).value = value;
  (handler as StorageHandlerAsObject).set = set;
  (handler as StorageHandlerAsObject).remove = remove;

  return handler as StorageHandlerAsArray & StorageHandlerAsObject;
}

export { useLocalstorage };
