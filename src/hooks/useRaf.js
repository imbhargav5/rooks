"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRaf = void 0;
var raf_1 = __importDefault(require("raf"));
var react_1 = require("react");
/**
 *
 * useRaf
 * Uses a polyfilled version of requestAnimationFrame
 *
 * @param {Function} callback The callback function to be executed
 * @param {boolean} [isActive=true] The value which while true, keeps the raf running infinitely
 */
function useRaf(callback, isActive) {
  var savedCallback = (0, react_1.useRef)();
  // Remember the latest function.
  (0, react_1.useEffect)(
    function () {
      savedCallback.current = callback;
    },
    [callback]
  );
  (0, react_1.useEffect)(
    function () {
      var animationFrame;
      var startTime;
      function tick() {
        var timeElapsed = Date.now() - startTime;
        startTime = Date.now();
        loop();
        savedCallback.current && savedCallback.current(timeElapsed);
      }
      function loop() {
        animationFrame = (0, raf_1.default)(tick);
      }
      if (isActive) {
        startTime = Date.now();
        loop();
        return function () {
          raf_1.default.cancel(animationFrame);
        };
      }
    },
    [isActive]
  );
}
exports.useRaf = useRaf;
