"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateEffect = void 0;
var react_1 = require("react");
var useWarningOnMountInDevelopment_1 = require("./useWarningOnMountInDevelopment");
/**
 *  useDidUpdate hook
 *
 *  Fires a callback on component update
 *  Can take in a list of conditions to fire callback when one of the
 *  conditions changes
 *  Will fire callback's cleanup function on update
 *
 * @param {Function} callback The callback and its cleanup to be called on update
 * @param {Array} conditions The list of variables which trigger update when they are changed
 * @returns {undefined}
 */
function useUpdateEffect(callback, conditions) {
  (0, useWarningOnMountInDevelopment_1.useWarningOnMountInDevelopment)(
    "useUpdateEffect is deprecated, it will be removed in rooks v7. Please use useDidUpdate instead."
  );
  var hasMountedRef = (0, react_1.useRef)(false);
  if (typeof conditions !== "undefined" && !Array.isArray(conditions)) {
    conditions = [conditions];
  } else if (Array.isArray(conditions) && conditions.length === 0) {
    console.warn(
      "Using [] as the second argument makes useUpdateEffect a noop. The second argument should either be `undefined` or an array of length greater than 0."
    );
  }
  (0, react_1.useEffect)(function () {
    if (hasMountedRef.current) {
      return callback();
    } else {
      hasMountedRef.current = true;
    }
  }, conditions);
}
exports.useUpdateEffect = useUpdateEffect;
