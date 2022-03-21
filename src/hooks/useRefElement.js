"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRefElement = void 0;
var react_1 = require("react");
/**
 * useRefElement hook for React
 * Helps bridge gap between callback ref and state
 * Manages the element called with callback ref api using state variable
 */
function useRefElement() {
  var _a = (0, react_1.useState)(null),
    refElement = _a[0],
    setRefElement = _a[1];
  var ref = (0, react_1.useCallback)(function (refElement) {
    setRefElement(refElement);
  }, []);
  return [ref, refElement];
}
exports.useRefElement = useRefElement;
