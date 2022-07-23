/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { noop } from "@/utils/noop";
import { useState, useEffect, useCallback } from "react";
import { useWarningOnMountInDevelopment } from "./useWarningOnMountInDevelopment";

type StorageHandlerAsObject = {
  value: any;
  set: (newValue: any) => void;
  remove: () => void;
};

type StorageHandlerAsArray = [any, (newValue: any) => void, () => void];

type StorageHandler = StorageHandlerAsArray & StorageHandlerAsObject;

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
  useWarningOnMountInDevelopment(
    "useLocalstorage is deprecated, it will be removed in the next major release. Please use useLocalstorageState instead."
  );

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
    const storedValue = localStorage.getItem(key) || "null";
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      console.error(error);
    }

    return storedValue;
  }

  function saveValueToLocalStorage(valueToSet: any) {
    if (typeof localStorage === "undefined") {
      return null;
    }

    return localStorage.setItem(key, JSON.stringify(valueToSet));
  }

  const set = useCallback((newValue: any) => {
    setValue(newValue);
    saveValueToLocalStorage(newValue);
  }, []);

  const listen = useCallback((event: StorageEvent) => {
    if (event.storageArea === localStorage && event.key === key) {
      setValue(event.newValue);
    }
  }, []);

  // eslint-disable-next-line consistent-return
  const remove = useCallback((): false | undefined => {
    set(null);
    if (typeof localStorage === "undefined") {
      return false;
    }
    localStorage.removeItem(key);
    return undefined;
  }, [key]);

  // initialize
  useEffect(() => {
    init();
  }, []);

  // check for changes across windows
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", listen);

      return () => {
        window.removeEventListener("storage", listen);
      };
    } else {
      console.warn("useLocalstorage: window is undefined.");
    }
    return noop;
  }, []);

  const handler = Object.assign([value, set, remove], {
    value,
    remove,
    set,
  });

  return handler as StorageHandler;
}

export { useLocalstorage };
