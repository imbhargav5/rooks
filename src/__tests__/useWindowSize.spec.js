"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_hooks_1 = require("@testing-library/react-hooks");
var useWindowSize_1 = require("../hooks/useWindowSize");
describe("useWindowSize", function () {
  it("should be defined", function () {
    expect(useWindowSize_1.useWindowSize).toBeDefined();
  });
  describe("basic", function () {
    it("should have an initial value on first render", function () {
      var result = (0, react_hooks_1.renderHook)(function () {
        return (0, useWindowSize_1.useWindowSize)();
      }).result;
      expect(result.current.innerHeight).not.toBeNull();
    });
  });
});
