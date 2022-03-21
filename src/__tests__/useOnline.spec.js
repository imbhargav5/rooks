"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_hooks_1 = require("@testing-library/react-hooks");
var useOnline_1 = require("../hooks/useOnline");
describe("useOnline", function () {
  var onlineGetter;
  beforeEach(function () {
    onlineGetter = jest.spyOn(window.navigator, "onLine", "get");
  });
  it("should be defined", function () {
    expect(useOnline_1.useOnline).toBeDefined();
  });
  it("should get the online status", function () {
    onlineGetter.mockReturnValue(true);
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0, useOnline_1.useOnline)();
    }).result;
    expect(result.current).toBe(true);
  });
  it("should get the offline status", function () {
    onlineGetter.mockReturnValue(false);
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0, useOnline_1.useOnline)();
    }).result;
    expect(result.current).toBe(false);
  });
});
