"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWillUnmount = void 0;
var react_1 = require("react");
/**
 * useWillUnmount hook
 * Fires a callback just before component unmounts
 *
 * @param {Function} callback Callback to be called before unmount
 */
function useWillUnmount(callback) {
  // run only once
  (0, react_1.useEffect)(function () {
    return callback;
  }, []);
}
exports.useWillUnmount = useWillUnmount;
