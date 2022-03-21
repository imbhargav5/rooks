"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warning = void 0;
var isDevelopmentEnvironment = process.env.NODE_ENV !== "production";
// eslint-disable-next-line import/no-mutable-exports
var warning = function () {};
exports.warning = warning;
if (isDevelopmentEnvironment) {
  var printWarning_1 = function printWarning() {
    var actualMessage = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      actualMessage[_i] = arguments[_i];
    }
    var message = "Warning: ".concat(actualMessage);
    if (typeof console !== "undefined") {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the call site that caused this warning to fire.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (_a) {}
  };
  exports.warning = warning = function (condition, actualMessage) {
    if (!condition) {
      printWarning_1(actualMessage);
    }
  };
}
