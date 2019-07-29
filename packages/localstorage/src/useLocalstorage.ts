import { useState, useEffect } from "react";

interface LocalStorageHandler {
  value: any;
  set: (newValue: any) => void;
  remove: () => void;
}

/**
 * useLocalStorage hook
 *
 * @param {string} key - Key of the localStorage object
 * @param {any} defaultValue - Default initial value
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
    return JSON.parse(localStorage.getItem(key) || "null");
  }

  function saveValueToLocalStorage(key: string, value: any) {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage.setItem(key, JSON.stringify(value));
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
