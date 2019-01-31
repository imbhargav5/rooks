import { useState, useEffect } from "react";

function useSessionStorage(key, defaultValue = null) {
  const [value, setValue] = useState(getValueFromSessionStorage(key));

  function init() {
    const initialValue = getValueFromSessionStorage(key);
    if (initialValue === null || initialValue === "null") {
      set(defaultValue);
    }
  }

  function getValueFromSessionStorage() {
    if (typeof sessionStorage === "undefined") {
      return null;
    }
    return sessionStorage.getItem(key);
  }

  function saveValueToSessionStorage(key, value) {
    if (typeof sessionStorage === "undefined") {
      return null;
    }
    return sessionStorage.setItem(key, value);
  }

  function set(newValue) {
    setValue(newValue);
    saveValueToSessionStorage(key, newValue);
  }

  function remove() {
    set(null);
    sessionStorage.removeItem(key);
  }

  useEffect(() => {
    init();
  }, []);

  return {
    value,
    set,
    remove
  };
}

module.exports = useSessionStorage;
