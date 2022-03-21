"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMutationObserver = void 0;
var react_1 = require("react");
var config = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};
/**
 *
 * useMutationObserver hook
 *
 * Returns a mutation observer for a React Ref and fires a callback
 *
 * @param {MutableRefObject<HTMLElement | null>} ref React ref on which mutations are to be observed
 * @param {MutationCallback} callback Function that needs to be fired on mutation
 * @param {MutationObserverInit} options
 */
function useMutationObserver(ref, callback, options) {
  if (options === void 0) {
    options = config;
  }
  (0, react_1.useEffect)(
    function () {
      // Create an observer instance linked to the callback function
      if (ref.current) {
        var observer_1 = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer_1.observe(ref.current, options);
        return function () {
          observer_1.disconnect();
        };
      }
    },
    [callback, options]
  );
}
exports.useMutationObserver = useMutationObserver;
