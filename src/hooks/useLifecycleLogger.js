"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLifecycleLogger = void 0;
var useDidMount_1 = require("./useDidMount");
var useUpdateEffect_1 = require("./useUpdateEffect");
var useWillUnmount_1 = require("./useWillUnmount");
/**
 * useLifecycleLogger hook
 * logs parameters as component transitions through lifecycles
 *
 * @param componentName Name of the component
 * @param rest
 */
var useLifecycleLogger = function (componentName) {
  if (componentName === void 0) {
    componentName = "Component";
  }
  var otherArgs = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    otherArgs[_i - 1] = arguments[_i];
  }
  (0, useDidMount_1.useDidMount)(function () {
    console.log.apply(
      console,
      __spreadArray(["".concat(componentName, " mounted")], otherArgs, false)
    );
    return function () {
      return console.log("".concat(componentName, " unmounted"));
    };
  });
  (0, useUpdateEffect_1.useUpdateEffect)(function () {
    console.log.apply(
      console,
      __spreadArray(["".concat(componentName, " updated")], otherArgs, false)
    );
  });
  (0, useWillUnmount_1.useWillUnmount)(function () {
    console.log("".concat(componentName, " unmounted"));
  });
};
exports.useLifecycleLogger = useLifecycleLogger;
