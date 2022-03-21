"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesIdentifierMatchKeyboardEvent = void 0;
var doesIdentifierMatchKeyboardEvent = function (error, identifier) {
  if (
    error.key === identifier ||
    error.code === identifier ||
    error.keyCode === identifier ||
    error.which === identifier ||
    error.charCode === identifier
  ) {
    return true;
  }
  return false;
};
exports.doesIdentifierMatchKeyboardEvent = doesIdentifierMatchKeyboardEvent;
