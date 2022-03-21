"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNavigatorLanguage = void 0;
var react_1 = require("react");
var useWindowEventListener_1 = require("./useWindowEventListener");
function getLanguage() {
  // eslint-disable-next-line no-negated-condition
  if (typeof navigator !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return navigator.language || navigator["userLanguage"];
  } else {
    return null;
  }
}
/**
 * useNavigatorLanguage hook
 * Returns the language of the navigator
 *
 * @returns {Language}
 */
function useNavigatorLanguage() {
  var _a = (0, react_1.useState)(getLanguage),
    language = _a[0],
    setLanguage = _a[1];
  (0, useWindowEventListener_1.useWindowEventListener)(
    "languagechange",
    function () {
      setLanguage(getLanguage);
    }
  );
  return language;
}
exports.useNavigatorLanguage = useNavigatorLanguage;
