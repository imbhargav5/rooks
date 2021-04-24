import { useEffect, useReducer, useCallback } from 'react';

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
type StorageHandler = StorageHandlerAsObject & {};

function reducer(state, action) {
  switch (action.type) {
    case 'set':
      return (state = action.payload);
    default:
      return state;
  }
}

/**
 * useSessionstorage
 * Tracks a value within sessionStorage and updates it
 *
 * @param key Key of the value to be stored
 * @param defaultValue Default value of the stored item
 */
function useSessionstorage(
  key: string,
  defaultValue: any = null
): StorageHandler {
  const [value, dispatch] = useReducer(reducer, getValueFromSessionStorage());

  function init() {
    const initialValue = getValueFromSessionStorage();
    if (initialValue === null || initialValue === 'null') {
      set(defaultValue);
    }
  }

  function getValueFromSessionStorage() {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }
    const storedValue = sessionStorage.getItem(key) || 'null';
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      console.error(error);
    }

    return storedValue;
  }

  function saveValueToSessionStorage(key: string, value: string | null) {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }

    return sessionStorage.setItem(key, JSON.stringify(value));
  }

  function setValue(value: string | null) {
    dispatch({
      payload: value,
      type: 'set',
    });
  }

  function set(newValue: string | null) {
    saveValueToSessionStorage(key, newValue);
    setValue(newValue);
  }

  function remove() {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }
    sessionStorage.removeItem(key);
    setValue(null);
  }

  useEffect(() => {
    init();
  }, []);

  const listen = useCallback((e: StorageEvent) => {
    if (e.storageArea === sessionStorage && e.key === key) {
      set(e.newValue);
    }
  }, []);

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

export { useSessionstorage };
