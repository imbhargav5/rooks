"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = void 0;
var lodash_debounce_1 = __importDefault(require("lodash.debounce"));
var react_1 = require("react");
/**
 * Debounce hook
 * Debounces a function
 *
 * @param callback The callback to debounce
 * @param wait The duration to debounce
 * @param options The options object.
 * @param options.leading Specify invoking on the leading edge of the timeout.
 * @param options.maxWait The maximum time func is allowed to be delayed before it’s invoked.
 * @param options.trailing Specify invoking on the trailing edge of the timeout.
 * @returns Returns the new debounced function.
 */
function useDebounce(callback, wait, options) {
  var createDebouncedCallback = (0, react_1.useCallback)(
    function (function_) {
      return (0, lodash_debounce_1.default)(function_, wait, options);
    },
    [wait, options]
  );
  var debouncedCallbackRef = (0, react_1.useRef)(
    createDebouncedCallback(callback)
  );
  (0, react_1.useEffect)(
    function () {
      debouncedCallbackRef.current = createDebouncedCallback(callback);
    },
    [callback, createDebouncedCallback]
  );
  return debouncedCallbackRef.current;
}
exports.useDebounce = useDebounce;
