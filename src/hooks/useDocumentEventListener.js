"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocumentEventListener = void 0;
var useGlobalObjectEventListener_1 = require("./useGlobalObjectEventListener");
/**
 *  useDocumentEventListener hook
 *
 *  A react hook to an event listener to the document
 *
 * @param {string} eventName The event to track
 * @param {Function} callback The callback to be called on event
 * @param {object} conditions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @returns {undefined}
 */
function useDocumentEventListener(
  eventName,
  callback,
  listenerOptions,
  isLayoutEffect
) {
  if (listenerOptions === void 0) {
    listenerOptions = {};
  }
  if (isLayoutEffect === void 0) {
    isLayoutEffect = false;
  }
  (0, useGlobalObjectEventListener_1.useGlobalObjectEventListener)(
    document,
    eventName,
    callback,
    listenerOptions,
    true,
    isLayoutEffect
  );
}
exports.useDocumentEventListener = useDocumentEventListener;
