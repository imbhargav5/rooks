"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInViewRef = void 0;
var react_1 = require("react");
var config = {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: [0, 1],
};
/**
 *
 * useInViewRef hook
 *
 * Returns a mutation observer for a React Ref and true/false when element enters/leaves the viewport. Also fires a callback.
 *
 * @param {IntersectionObserverCallback} callback Function that needs to be fired on mutation
 * @param {IntersectionObserverInit} options
 */
function useInViewRef(callback, options) {
  if (callback === void 0) {
    callback = function () {};
  }
  if (options === void 0) {
    options = config;
  }
  var _a = options.root,
    root = _a === void 0 ? null : _a,
    rootMargin = options.rootMargin,
    threshold = options.threshold;
  var _b = (0, react_1.useState)(null),
    node = _b[0],
    setNode = _b[1];
  var _c = (0, react_1.useState)(false),
    inView = _c[0],
    setInView = _c[1];
  (0, react_1.useEffect)(
    function () {
      // Create an observer instance linked to the callback function
      if (node) {
        var observer_1 = new IntersectionObserver(function (
          entries,
          observerRef
        ) {
          entries.forEach(function (_a) {
            var isIntersecting = _a.isIntersecting;
            return setInView(isIntersecting);
          });
          callback(entries, observerRef);
        },
        options);
        // Start observing the target node for configured mutations
        observer_1.observe(node);
        return function () {
          observer_1.disconnect();
        };
      }
    },
    [node, callback, root, rootMargin, threshold]
  );
  var ref = (0, react_1.useCallback)(function (node) {
    setNode(node);
  }, []);
  return [ref, inView];
}
exports.useInViewRef = useInViewRef;
