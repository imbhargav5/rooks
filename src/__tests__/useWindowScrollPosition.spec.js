"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_1 = require("@testing-library/react");
var react_hooks_1 = require("@testing-library/react-hooks");
var useWindowScrollPosition_1 = require("../hooks/useWindowScrollPosition");
describe("useWindowScrollPosition", function () {
  it("should be defined", function () {
    expect(useWindowScrollPosition_1.useWindowScrollPosition).toBeDefined();
  });
  describe("basic", function () {
    it("should call callback after resize", function () {
      var result = (0, react_hooks_1.renderHook)(function () {
        return (0, useWindowScrollPosition_1.useWindowScrollPosition)();
      }).result;
      expect(result.current.scrollX).toBe(0);
      expect(result.current.scrollY).toBe(0);
      (0, react_hooks_1.act)(function () {
        react_1.fireEvent.scroll(window, { target: { pageYOffset: 100 } });
      });
      expect(result.current.scrollX).toBe(0);
      expect(result.current.scrollY).toBe(100);
      (0, react_hooks_1.act)(function () {
        react_1.fireEvent.scroll(window, { target: { pageXOffset: 300 } });
      });
      expect(result.current.scrollX).toBe(300);
      expect(result.current.scrollY).toBe(100);
    });
  });
});
// figure out tests
