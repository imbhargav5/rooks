/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer, useCallback } from 'react';

type StorageHandlerAsObject = {
  value: any;
  set: (newValue: any) => void;
  remove: () => void;
};

type StorageHandlerAsArray = [any, (newValue: any) => void, () => void];

type StorageHandler = StorageHandlerAsArray & StorageHandlerAsObject;

function reducer(state, action) {
  switch (action.type) {
    case 'set':
      return action.payload;
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

  function saveValueToSessionStorage(valueToSet: string | null) {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }

    return sessionStorage.setItem(key, JSON.stringify(valueToSet));
  }

  function setValue(valueToSet: string | null) {
    dispatch({
      payload: valueToSet,
      type: 'set',
    });
  }

  function set(newValue: string | null) {
    saveValueToSessionStorage(newValue);
    setValue(newValue);
  }

  // eslint-disable-next-line consistent-return
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

  const listen = useCallback((event: StorageEvent) => {
    if (event.storageArea === sessionStorage && event.key === key) {
      set(event.newValue);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('storage', listen);

    return () => {
      window.removeEventListener('storage', listen);
    };
  }, []);

  const handler = Object.assign([value, set, remove], {
    remove,
    set,
    value,
  });

  return handler as StorageHandler;
}

export { useSessionstorage };
