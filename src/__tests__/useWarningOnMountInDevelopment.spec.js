"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_hooks_1 = require("@testing-library/react-hooks");
var useWarningOnMountInDevelopment_1 = require("../hooks/useWarningOnMountInDevelopment");
describe("useWarningOnMountInDevelopment", function () {
  it("is defined", function () {
    expect(
      useWarningOnMountInDevelopment_1.useWarningOnMountInDevelopment
    ).toBeDefined();
  });
  it("logs error in dev env", function () {
    var spy = jest.spyOn(global.console, "error");
    (0, react_hooks_1.renderHook)(function () {
      return (0,
      useWarningOnMountInDevelopment_1.useWarningOnMountInDevelopment)("message");
    });
    expect(spy).toHaveBeenCalled();
  });
});
