"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOnline = void 0;
var react_1 = require("react");
/**
 *
 * @returns {boolean} Is navigator online
 */
function getIsOnline() {
  if (typeof window === "undefined") {
    return null;
  }
  return navigator.onLine;
}
/**
 * useOnline hook
 *
 * Returns true if navigator is online, false if not.
 *
 * @returns {boolean} The value of navigator.onLine
 */
function useOnline() {
  var _a = (0, react_1.useState)(function () {
      return getIsOnline();
    }),
    online = _a[0],
    changeOnline = _a[1];
  function setOffline() {
    changeOnline(false);
  }
  function setOnline() {
    changeOnline(true);
  }
  // we only needs this to be set on mount
  // hence []
  (0, react_1.useEffect)(function () {
    if (typeof window !== "undefined") {
      window.addEventListener("online", setOnline);
      window.addEventListener("offline", setOffline);
      return function () {
        window.removeEventListener("online", setOnline);
        window.removeEventListener("offline", setOffline);
      };
    } else {
      console.warn("useOnline: window is undefined.");
    }
  }, []);
  return online;
}
exports.useOnline = useOnline;
