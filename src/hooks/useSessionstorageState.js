"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSessionstorageState = void 0;
var react_1 = require("react");
function getValueFromSessionStorage(key) {
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
function saveValueToSessionStorage(key, value) {
  if (typeof sessionStorage === "undefined") {
    return null;
  }
  return sessionStorage.setItem(key, JSON.stringify(value));
}
/**
 * @param key Key of the sessionStorage object
 * @param initialState Default initial value
 */
function initialize(key, initialState) {
  var valueLoadedFromSessionStorage = getValueFromSessionStorage(key);
  if (valueLoadedFromSessionStorage === null) {
    return initialState;
  } else {
    return valueLoadedFromSessionStorage;
  }
}
/**
 * useSessionstorageState hook
 * Tracks a value within sessionStorage and updates it
 *
 * @param {string} key - Key of the sessionStorage object
 * @param {any} initialState - Default initial value
 */
function useSessionstorageState(key, initialState) {
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
        saveValueToSessionStorage(key, value);
      }
    },
    [value]
  );
  var listen = (0, react_1.useCallback)(
    function (e) {
      if (e.storageArea === sessionStorage && e.key === key) {
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
    },
    [value]
  );
  // check for changes across windows
  (0, react_1.useEffect)(function () {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", listen);
      return function () {
        window.removeEventListener("storage", listen);
      };
    } else {
      console.warn("useSessionstorageState: window is undefined.");
    }
  }, []);
  var setValue = (0, react_1.useCallback)(function (newValue) {
    isUpdateFromListener.current = false;
    __setValue(newValue);
  }, []);
  var remove = (0, react_1.useCallback)(function () {
    sessionStorage.removeItem(key);
  }, []);
  return [value, setValue, remove];
}
exports.useSessionstorageState = useSessionstorageState;
