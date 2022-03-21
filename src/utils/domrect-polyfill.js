"use strict";
/* eslint-disable eqeqeq */
/* eslint-disable id-length */
/* eslint-disable fp/no-this */
/* eslint-disable no-eq-null */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable fp/no-class */
// Polyfill DOMRect
// It's not available on Edge or IE11
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMRectPolyfill = void 0;
var DOMRectPolyfill = /** @class */ (function () {
  function DOMRectPolyfill(x, y, width, height) {
    // DOMRect's properties are all non-enumerable
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    if (x != null) {
      this.x = x;
    }
    if (y != null) {
      this.y = y;
    }
    if (width != null) {
      this.width = width;
    }
    if (height != null) {
      this.height = height;
    }
  }
  DOMRectPolyfill.fromRect = function (rect) {
    var _a, _b, _c, _d;
    if (rect === void 0) {
      rect = {};
    }
    return new this(
      (_a = rect.x) !== null && _a !== void 0 ? _a : 0,
      (_b = rect.y) !== null && _b !== void 0 ? _b : 0,
      (_c = rect.width) !== null && _c !== void 0 ? _c : 0,
      (_d = rect.height) !== null && _d !== void 0 ? _d : 0
    );
  };
  Object.defineProperty(DOMRectPolyfill.prototype, "top", {
    get: function () {
      return this.y;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(DOMRectPolyfill.prototype, "right", {
    get: function () {
      return this.x + this.width;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(DOMRectPolyfill.prototype, "bottom", {
    get: function () {
      return this.y + this.height;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(DOMRectPolyfill.prototype, "left", {
    get: function () {
      return this.x;
    },
    enumerable: false,
    configurable: true,
  });
  // But it has a toJSON that does include all the properties.
  DOMRectPolyfill.prototype.toJSON = function () {
    return {
      bottom: this.bottom,
      height: this.height,
      left: this.left,
      right: this.right,
      top: this.top,
      width: this.width,
      x: this.x,
      y: this.y,
    };
  };
  return DOMRectPolyfill;
})();
exports.DOMRectPolyfill = DOMRectPolyfill;
