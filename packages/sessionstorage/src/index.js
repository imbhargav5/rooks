import { useState, useReducer, useEffect } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "set":
      return (state = action.payload);
    default:
      return state;
  }
}

function useSessionStorage(key, defaultValue = null) {
  const [value, dispatch] = useReducer(
    reducer,
    getValueFromSessionStorage(key)
  );

  function init() {
    const initialValue = getValueFromSessionStorage(key);
    console.log({ initialValue, defaultValue });
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

  function setValue(value) {
    dispatch({
      type: "set",
      payload: value
    });
  }

  function set(newValue) {
    console.log({ newValue });
    saveValueToSessionStorage(key, newValue);
    setValue(newValue);
  }

  function remove() {
    sessionStorage.removeItem(key);
    setValue(null);
  }

  useEffect(() => {
    init();
  }, []);

  function listen(e) {
    if (e.storageArea === sessionStorage && e.key === key) {
      console.log(e.newValue);
      set(e.newValue);
    }
  }

  useEffect(() => {
    window.addEventListener("storage", listen);
    return () => {
      window.removeEventListener("storage", listen);
    };
  }, []);

  return {
    value,
    set,
    remove
  };
}

module.exports = useSessionStorage;
