"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCountdown = void 0;
var react_1 = require("react");
var useIntervalWhen_1 = require("./useIntervalWhen");
/**
 *
 * useCountdown
 * Easy way to countdown until a given endtime in intervals
 *
 * @param endTime Time to countdown
 * @param options  Countdown options
 */
function useCountdown(endTime, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.interval,
    interval = _a === void 0 ? 1000 : _a,
    onDown = options.onDown,
    onEnd = options.onEnd;
  var _b = (0, react_1.useState)(function () {
      return new Date();
    }),
    time = _b[0],
    setTime = _b[1];
  var restTime = endTime.getTime() - time.getTime();
  var count = restTime > 0 ? Math.ceil(restTime / interval) : 0;
  (0, useIntervalWhen_1.useIntervalWhen)(
    onTick,
    count ? interval : undefined,
    true,
    true
  );
  return count;
  function onTick() {
    var newTime = new Date();
    if (newTime > endTime) {
      if (onEnd) {
        onEnd(newTime);
      }
      setTime(endTime);
      return;
    }
    if (onDown) {
      onDown(restTime, newTime);
    }
    setTime(newTime);
  }
}
exports.useCountdown = useCountdown;
