"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDidMount = void 0;
var react_1 = require("react");
/**
 * useDidMount hook
 * Calls a function on mount
 *
 * @param {Function} callback Callback function to be called on mount
 */
function useDidMount(callback) {
  (0, react_1.useEffect)(function () {
    if (typeof callback === "function") {
      callback();
    }
  }, []);
}
exports.useDidMount = useDidMount;
