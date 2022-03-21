"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_hooks_1 = require("@testing-library/react-hooks");
var useFullscreen_1 = require("../hooks/useFullscreen");
describe("useFullscreen", function () {
  it("should forward requestFullscreenOptions to requestFullscreen", function () {
    document.exitFullscreen = jest.fn();
    var element = { requestFullscreen: jest.fn() };
    var mockRequestFullscreenOptions = { navigationUI: "show" };
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0,
      useFullscreen_1.useFullscreen)({ requestFullscreenOptions: { navigationUI: "show" } });
    }).result;
    expect(typeof result.current).toBe("object");
    (0, react_hooks_1.act)(function () {
      var _a;
      (_a = result.current) === null || _a === void 0
        ? void 0
        : _a.request(element);
    });
    expect(element.requestFullscreen).toHaveBeenCalledWith(
      mockRequestFullscreenOptions
    );
  });
});
