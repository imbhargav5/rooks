/* eslint-disable eqeqeq */
/* eslint-disable id-length */
/* eslint-disable fp/no-this */
/* eslint-disable no-eq-null */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable fp/no-class */
// Polyfill DOMRect
// It's not available on Edge or IE11

export class DOMRectPolyfill implements DOMRect {
  static fromRect(
    rect: { x?: number; y?: number; width?: number; height?: number } = {}
  ) {
    return new this(
      rect.x ?? 0,
      rect.y ?? 0,
      rect.width ?? 0,
      rect.height ?? 0
    );
  }

  constructor(x?: number, y?: number, width?: number, height?: number) {
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

  // DOMRect's properties are all non-enumerable
  x = 0;

  y = 0;

  width = 0;

  height = 0;

  get top() {
    return this.y;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }

  get left() {
    return this.x;
  }

  // But it has a toJSON that does include all the properties.
  toJSON() {
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
  }
}
