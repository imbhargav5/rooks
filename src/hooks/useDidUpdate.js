"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDidUpdate = void 0;
var react_1 = require("react");
/**
 *  useDidUpdate hook
 *
 *  Fires a callback on component update
 *  Can take in a list of conditions to fire callback when one of the
 *  conditions changes
 *
 * @param {Function} callback The callback to be called on update
 * @param {Array} conditions The list of variables which trigger update when they are changed
 * @returns {undefined}
 */
function useDidUpdate(callback, conditions) {
  var hasMountedRef = (0, react_1.useRef)(false);
  if (typeof conditions !== "undefined" && !Array.isArray(conditions)) {
    conditions = [conditions];
  } else if (Array.isArray(conditions) && conditions.length === 0) {
    console.warn(
      "Using [] as the second argument makes useDidUpdate a noop. The second argument should either be `undefined` or an array of length greater than 0."
    );
  }
  (0, react_1.useEffect)(function () {
    if (hasMountedRef.current) {
      callback();
    } else {
      hasMountedRef.current = true;
    }
  }, conditions);
}
exports.useDidUpdate = useDidUpdate;
