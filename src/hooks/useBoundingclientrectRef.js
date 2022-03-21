"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBoundingclientrectRef = void 0;
var react_1 = require("react");
var useForkRef_1 = require("./useForkRef");
var useMutationObserverRef_1 = require("./useMutationObserverRef");
/**
 * @param element HTML element whose boundingclientrect is needed
 * @returns ClientRect
 */
function getBoundingClientRect(element) {
  return element.getBoundingClientRect();
}
/**
 * useBoundingclientrectRef hook
 *
 * @returns [CallbackRef | null, ClientRect | DOMRect | null, () => void]
 */
function useBoundingclientrectRef() {
  var _a = (0, react_1.useState)(null),
    value = _a[0],
    setValue = _a[1];
  var _b = (0, react_1.useState)(null),
    node = _b[0],
    setNode = _b[1];
  var update = (0, react_1.useCallback)(
    function () {
      setValue(node ? getBoundingClientRect(node) : null);
    },
    [node]
  );
  (0, react_1.useEffect)(
    function () {
      update();
    },
    [node]
  );
  var ref = (0, react_1.useCallback)(function (node) {
    setNode(node);
  }, []);
  var mutationObserverRef = (0,
  useMutationObserverRef_1.useMutationObserverRef)(update)[0];
  var forkedRef = (0, useForkRef_1.useForkRef)(ref, mutationObserverRef);
  return [forkedRef, value, update];
}
exports.useBoundingclientrectRef = useBoundingclientrectRef;
