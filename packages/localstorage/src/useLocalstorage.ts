import { useState, useEffect } from "react";

interface LocalStorageHandler {
  value: string | null;
  set: (newValue: string) => void;
  remove: () => void;
}

/**
 * useLocalStorage hook
 *
 * @param {string} key - Key of the localStorage object
 * @param {string} defaultValue - Default initial value
 */
function useLocalStorage(key: string, defaultValue: any = null) {
  const [value, setValue] = useState(getValueFromLocalStorage());

  function init() {
    const valueLoadedFromLocalStorage = getValueFromLocalStorage();
    if (
      valueLoadedFromLocalStorage === null ||
      valueLoadedFromLocalStorage === "null"
    ) {
      set(defaultValue);
    }
  }

  function getValueFromLocalStorage() {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage.getItem(key);
  }

  function saveValueToLocalStorage(key: string, value: string | null) {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage.setItem(key, String(value));
  }

  function set(newValue: any) {
    setValue(newValue);
    saveValueToLocalStorage(key, newValue);
  }

  function listen(e: StorageEvent) {
    if (e.storageArea === localStorage && e.key === key) {
      setValue(e.newValue);
    }
  }

  function remove() {
    set(null);
    if (typeof localStorage === "undefined") {
      return false;
    }
    localStorage.removeItem(key);
  }

  //initialize
  useEffect(() => {
    init();
  }, []);

  // check for changes across windows
  useEffect(() => {
    window.addEventListener("storage", listen);
    return () => {
      window.removeEventListener("storage", listen);
    };
  });

  const handler: LocalStorageHandler = {
    value,
    set,
    remove
  };

  return handler;
}

export { useLocalStorage };
