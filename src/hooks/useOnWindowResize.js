"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOnWindowResize = void 0;
var useGlobalObjectEventListener_1 = require("./useGlobalObjectEventListener");
/**
 *
 * useOnWindowResize hook
 *
 * Fires a callback when window resizes
 *
 * @param {Function} callback Callback to be called before unmount
 * @param {boolean} when When the handler should be applied
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 */
function useOnWindowResize(callback, when, isLayoutEffect) {
  if (when === void 0) {
    when = true;
  }
  if (isLayoutEffect === void 0) {
    isLayoutEffect = false;
  }
  if (typeof window !== "undefined") {
    (0, useGlobalObjectEventListener_1.useGlobalObjectEventListener)(
      window,
      "resize",
      callback,
      { passive: true },
      when,
      isLayoutEffect
    );
  } else {
    console.warn(
      "useOnWindowResize can't attach an event listener as window is undefined."
    );
  }
}
exports.useOnWindowResize = useOnWindowResize;
