"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMutationObserverRef = void 0;
var react_1 = require("react");
var config = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};
/**
 *
 * useMutationObserverRef hook
 *
 * Returns a mutation observer for a React Ref and fires a callback
 *
 * @param {MutationCallback} callback Function that needs to be fired on mutation
 * @param {MutationObserverInit} options
 */
function useMutationObserverRef(callback, options) {
  if (options === void 0) {
    options = config;
  }
  var _a = (0, react_1.useState)(null),
    node = _a[0],
    setNode = _a[1];
  (0, react_1.useEffect)(
    function () {
      // Create an observer instance linked to the callback function
      if (node) {
        var observer_1 = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer_1.observe(node, options);
        return function () {
          observer_1.disconnect();
        };
      }
    },
    [node, callback, options]
  );
  var ref = (0, react_1.useCallback)(function (node) {
    setNode(node);
  }, []);
  return [ref];
}
exports.useMutationObserverRef = useMutationObserverRef;
