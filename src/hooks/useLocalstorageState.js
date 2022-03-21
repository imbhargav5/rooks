"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalstorageState = void 0;
var react_1 = require("react");
function getValueFromLocalStorage(key) {
  if (typeof localStorage === "undefined") {
    return null;
  }
  var storedValue = localStorage.getItem(key) || "null";
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(error);
  }
  return storedValue;
}
function saveValueToLocalStorage(key, value) {
  if (typeof localStorage === "undefined") {
    return null;
  }
  return localStorage.setItem(key, JSON.stringify(value));
}
/**
 * @param key Key of the localStorage object
 * @param initialState Default initial value
 */
function initialize(key, initialState) {
  var valueLoadedFromLocalStorage = getValueFromLocalStorage(key);
  if (valueLoadedFromLocalStorage === null) {
    return initialState;
  } else {
    return valueLoadedFromLocalStorage;
  }
}
/**
 * useLocalstorageState hook
 * Tracks a value within localStorage and updates it
 *
 * @param {string} key - Key of the localStorage object
 * @param {any} initialState - Default initial value
 */
function useLocalstorageState(key, initialState) {
  var _a = (0, react_1.useState)(function () {
      return initialize(key, initialState);
    }),
    value = _a[0],
    __setValue = _a[1];
  var isUpdateFromListener = (0, react_1.useRef)(false);
  (0, react_1.useEffect)(
    function () {
      /**
       * We need to ensure there is no loop of
       * storage events fired. Hence we are using a ref
       * to keep track of whether setValue is from another
       * storage event
       */
      if (!isUpdateFromListener.current) {
        saveValueToLocalStorage(key, value);
      }
    },
    [value]
  );
  var listen = (0, react_1.useCallback)(function (e) {
    if (e.storageArea === localStorage && e.key === key) {
      try {
        isUpdateFromListener.current = true;
        var newValue = JSON.parse(e.newValue || "null");
        if (value !== newValue) {
          __setValue(newValue);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
  // check for changes across windows
  (0, react_1.useEffect)(function () {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", listen);
      return function () {
        window.removeEventListener("storage", listen);
      };
    } else {
      console.warn("useLocalstorageState: window is undefined.");
    }
  }, []);
  var setValue = (0, react_1.useCallback)(function (newValue) {
    isUpdateFromListener.current = false;
    __setValue(newValue);
  }, []);
  var remove = (0, react_1.useCallback)(function () {
    localStorage.removeItem(key);
  }, []);
  return [value, setValue, remove];
}
exports.useLocalstorageState = useLocalstorageState;
