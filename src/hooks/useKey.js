"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKey = void 0;
var react_1 = require("react");
var doesIdentifierMatchKeyboardEvent_1 = require("../utils/doesIdentifierMatchKeyboardEvent");
var defaultOptions = {
  eventTypes: ["keydown"],
  when: true,
};
/**
 * useKey hook
 *
 * Fires a callback on keyboard events like keyDown, keyPress and keyUp
 *
 * @param {[string|number]} keyList
 * @param {Function} callback
 * @param {Options} options
 */
function useKey(input, callback, options_) {
  var keyList = (0, react_1.useMemo)(
    function () {
      if (Array.isArray(input)) {
        return input;
      } else {
        return [input];
      }
    },
    [input]
  );
  var options = Object.assign({}, defaultOptions, options_);
  var when = options.when,
    eventTypes = options.eventTypes;
  var callbackRef = (0, react_1.useRef)(callback);
  var target = options.target;
  (0, react_1.useEffect)(function () {
    callbackRef.current = callback;
  });
  var handle = (0, react_1.useCallback)(
    function (e) {
      if (
        keyList.some(function (identifier) {
          return (0,
          doesIdentifierMatchKeyboardEvent_1.doesIdentifierMatchKeyboardEvent)(e, identifier);
        })
      ) {
        callbackRef.current(e);
      }
    },
    [keyList]
  );
  (0, react_1.useEffect)(
    function () {
      if (when && typeof window !== "undefined") {
        var targetNode_1 = target ? target.current : window;
        eventTypes.forEach(function (eventType) {
          targetNode_1 && targetNode_1.addEventListener(eventType, handle);
        });
        return function () {
          eventTypes.forEach(function (eventType) {
            targetNode_1 && targetNode_1.removeEventListener(eventType, handle);
          });
        };
      }
    },
    [when, eventTypes, keyList, target, callback]
  );
}
exports.useKey = useKey;
