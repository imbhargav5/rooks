"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFreshTick = void 0;
var useFreshRef_1 = require("./useFreshRef");
function useFreshTick(callback) {
  var freshRef = (0, useFreshRef_1.useFreshRef)(callback);
  function tick() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (freshRef && typeof freshRef.current === "function") {
      freshRef.current.apply(freshRef, args);
    }
  }
  return tick;
}
exports.useFreshTick = useFreshTick;
