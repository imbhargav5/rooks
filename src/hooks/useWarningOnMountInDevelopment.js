"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWarningOnMountInDevelopment = void 0;
var useDidMount_1 = require("./useDidMount");
var warning_1 = require("./warning");
function useWarningOnMountInDevelopment(message) {
  (0, useDidMount_1.useDidMount)(function () {
    (0, warning_1.warning)(false, message);
  });
}
exports.useWarningOnMountInDevelopment = useWarningOnMountInDevelopment;
