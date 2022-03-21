"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSessionstorage = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var react_1 = require("react");
var useWarningOnMountInDevelopment_1 = require("./useWarningOnMountInDevelopment");
function reducer(state, action) {
  switch (action.type) {
    case "set":
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
function useSessionstorage(key, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = null;
  }
  (0, useWarningOnMountInDevelopment_1.useWarningOnMountInDevelopment)(
    "useSessionstorage is deprecated, it will be removed in rooks v7. Please use useSessionstorageState instead."
  );
  var _a = (0, react_1.useReducer)(reducer, getValueFromSessionStorage()),
    value = _a[0],
    dispatch = _a[1];
  function init() {
    var initialValue = getValueFromSessionStorage();
    if (initialValue === null || initialValue === "null") {
      set(defaultValue);
    }
  }
  function getValueFromSessionStorage() {
    if (typeof sessionStorage === "undefined") {
      return null;
    }
    var storedValue = sessionStorage.getItem(key) || "null";
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      console.error(error);
    }
    return storedValue;
  }
  function saveValueToSessionStorage(valueToSet) {
    if (typeof sessionStorage === "undefined") {
      return null;
    }
    return sessionStorage.setItem(key, JSON.stringify(valueToSet));
  }
  function setValue(valueToSet) {
    dispatch({
      payload: valueToSet,
      type: "set",
    });
  }
  function set(newValue) {
    saveValueToSessionStorage(newValue);
    setValue(newValue);
  }
  // eslint-disable-next-line consistent-return
  function remove() {
    if (typeof sessionStorage === "undefined") {
      return null;
    }
    sessionStorage.removeItem(key);
    setValue(null);
  }
  (0, react_1.useEffect)(function () {
    init();
  }, []);
  var listen = (0, react_1.useCallback)(function (event) {
    if (event.storageArea === sessionStorage && event.key === key) {
      set(event.newValue);
    }
  }, []);
  (0, react_1.useEffect)(function () {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", listen);
      return function () {
        window.removeEventListener("storage", listen);
      };
    } else {
      console.warn("useSessionstorage: window is undefined.");
    }
  }, []);
  var handler = Object.assign([value, set, remove], {
    remove: remove,
    set: set,
    value: value,
  });
  return handler;
}
exports.useSessionstorage = useSessionstorage;
