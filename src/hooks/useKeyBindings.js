"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyBindings = void 0;
var useKey_1 = require("./useKey");
/**
 * useKeyBindings
 *
 * useKeyBindings binds pairs of keyboard events and handlers
 *
 * @param { [key: string]: (e: KeyboardEvent) => void } keys
 * @param {Options} options
 */
var useKeyBindings = function (keyBindings, options_) {
  for (var key in keyBindings) {
    (0, useKey_1.useKey)(key, keyBindings[key], options_);
  }
};
exports.useKeyBindings = useKeyBindings;
