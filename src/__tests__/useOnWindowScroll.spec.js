"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_1 = require("@testing-library/react");
var react_hooks_1 = require("@testing-library/react-hooks");
var useOnWindowScroll_1 = require("../hooks/useOnWindowScroll");
describe("useOnWindowScroll", function () {
  it("should be defined", function () {
    expect(useOnWindowScroll_1.useOnWindowScroll).toBeDefined();
  });
  describe("basic", function () {
    var mockCallback = jest.fn(function () {});
    it("should call callback after resize", function () {
      (0, react_hooks_1.renderHook)(function () {
        return (0, useOnWindowScroll_1.useOnWindowScroll)(mockCallback);
      });
      (0, react_1.fireEvent)(window, new Event("scroll"));
      expect(mockCallback.mock.calls.length).toBe(1);
      (0, react_1.fireEvent)(window, new Event("scroll"));
      (0, react_1.fireEvent)(window, new Event("scroll"));
      expect(mockCallback.mock.calls.length).toBe(3);
    });
  });
});
