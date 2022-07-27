import { useEffect, useCallback, useState } from "react";
import { useDidMount } from "./useDidMount";
import { useWarningOnMountInDevelopment } from "./useWarningOnMountInDevelopment";

type StorageHandlerAsObject<T> = {
  remove: () => null | undefined;
  set: (newValue: T) => void;
  value: T;
};

type StorageHandlerAsArray<T> = [T, (newValue: T) => void, () => void];

type StorageHandler<T> = StorageHandlerAsArray<T> & StorageHandlerAsObject<T>;

/**
 * useSessionstorage
 * Tracks a value within sessionStorage and updates it
 *
 * @param key Key of the value to be stored
 * @param defaultValue Default value of the stored item
 * @see {@link https://react-hooks.org/docs/useSessionstorage}
 */
function useSessionstorage<T>(
  key: string,
  defaultValue: T | null = null
): StorageHandler<T> {
  useWarningOnMountInDevelopment(
    "useSessionstorage is deprecated, it will be removed in the next major release. Please use useSessionstorageState instead."
  );

  const parseJSONString = useCallback((valueToParse: string | null) => {
    if (!valueToParse) {
      return null;
    }

    try {
      return JSON.parse(valueToParse) as T;
    } catch {
      return valueToParse as unknown as T;
    }
  }, []);

  const getValueFromSessionStorage: () => T | null = useCallback(() => {
    if (typeof sessionStorage === "undefined") {
      return null;
    }

    const storedValue = sessionStorage.getItem(key) ?? "null";
    return parseJSONString(storedValue);
  }, [key, parseJSONString]);

  const [value, setValue] = useState<T | null>(getValueFromSessionStorage());

  const saveValueToSessionStorage = useCallback(
    (valueToSet: T | null) => {
      if (typeof sessionStorage === "undefined") {
        return null;
      }

      return sessionStorage.setItem(key, JSON.stringify(valueToSet));
    },
    [key]
  );

  const set = useCallback(
    (newValue: T | null) => {
      saveValueToSessionStorage(newValue);
      setValue(newValue);
    },
    [saveValueToSessionStorage, setValue]
  );

  // eslint-disable-next-line consistent-return
  function remove(): null | undefined {
    if (typeof sessionStorage === "undefined") {
      return null;
    }

    sessionStorage.removeItem(key);
    setValue(null);
    return undefined;
  }

  function init() {
    const initialValue = getValueFromSessionStorage();
    if (
      initialValue === null ||
      (initialValue as unknown as string) === "null"
    ) {
      set(defaultValue);
    }
  }

  useDidMount(() => {
    init();
  });

  const listen = useCallback(
    (event: StorageEvent) => {
      if (event.storageArea === sessionStorage && event.key === key) {
        set(parseJSONString(event.newValue));
      }
    },
    [key, parseJSONString, set]
  );

  useEffect(() => {
    window.addEventListener("storage", listen);

    return () => {
      window.removeEventListener("storage", listen);
    };
  }, [listen]);

  const handler = Object.assign([value, set, remove], {
    remove,
    set,
    value,
  });

  return handler as StorageHandler<T>;
}

export { useSessionstorage };
