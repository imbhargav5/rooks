"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBoundingclientrect = void 0;
var react_1 = require("react");
var useDidMount_1 = require("./useDidMount");
var useMutationObserver_1 = require("./useMutationObserver");
/**
 * @param element HTML element whose boundingclientrect is needed
 * @returns ClientRect
 */
function getBoundingClientRect(element) {
  return element.getBoundingClientRect();
}
/**
 * useBoundingclientRect hook
 *
 * @param ref The React ref whose ClientRect is needed
 * @returns ClientRect
 */
function useBoundingclientrect(ref) {
  var _a = (0, react_1.useState)(null),
    value = _a[0],
    setValue = _a[1];
  var update = (0, react_1.useCallback)(function () {
    setValue(ref.current ? getBoundingClientRect(ref.current) : null);
  }, []);
  (0, useDidMount_1.useDidMount)(function () {
    update();
  });
  (0, useMutationObserver_1.useMutationObserver)(ref, update);
  return value;
}
exports.useBoundingclientrect = useBoundingclientrect;
