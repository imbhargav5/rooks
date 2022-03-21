"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_1 = require("@testing-library/react");
var react_hooks_1 = require("@testing-library/react-hooks");
var useOnWindowResize_1 = require("../hooks/useOnWindowResize");
describe("useOnWindowResize", function () {
  it("should be defined", function () {
    expect(useOnWindowResize_1.useOnWindowResize).toBeDefined();
  });
  describe("basic", function () {
    var mockCallback = jest.fn(function () {});
    it("should call callback after resize", function () {
      (0, react_hooks_1.renderHook)(function () {
        return (0, useOnWindowResize_1.useOnWindowResize)(mockCallback);
      });
      (0, react_1.fireEvent)(window, new Event("resize"));
      expect(mockCallback.mock.calls.length).toBe(1);
      (0, react_1.fireEvent)(window, new Event("resize"));
      (0, react_1.fireEvent)(window, new Event("resize"));
      expect(mockCallback.mock.calls.length).toBe(3);
    });
  });
});
