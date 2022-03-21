"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_hooks_1 = require("@testing-library/react-hooks");
var useLifecycleLogger_1 = require("../hooks/useLifecycleLogger");
var logSpy = jest
  .spyOn(global.console, "log")
  .mockImplementation(function () {});
describe("useLifecycleLogger", function () {
  afterEach(function () {
    logSpy.mockClear();
    (0, react_hooks_1.cleanup)();
  });
  it("should be defined", function () {
    expect(useLifecycleLogger_1.useLifecycleLogger).toBeDefined();
  });
  it("should work without arguments", function () {
    var unmount = (0, react_hooks_1.renderHook)(function () {
      return (0, useLifecycleLogger_1.useLifecycleLogger)();
    }).unmount;
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenLastCalledWith("Component mounted");
    unmount();
    expect(logSpy).toHaveBeenCalledTimes(2);
  });
  it("should log the provided args on mount", function () {
    var args = ["foo", "bar"];
    var unmount = (0, react_hooks_1.renderHook)(function () {
      return (0, useLifecycleLogger_1.useLifecycleLogger)("Test1", args);
    }).unmount;
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenLastCalledWith("Test1 mounted", args);
    unmount();
    expect(logSpy).toHaveBeenCalledTimes(2);
  });
  it("should log when the component has unmounted", function () {
    var args = ["foo", "bar"];
    var unmount = (0, react_hooks_1.renderHook)(function () {
      return (0, useLifecycleLogger_1.useLifecycleLogger)("Test2", args);
    }).unmount;
    unmount();
    expect(logSpy).toHaveBeenLastCalledWith("Test2 unmounted");
  });
  it("should log updates as args change", function () {
    var _a = (0, react_hooks_1.renderHook)(
        function (_a) {
          var componentName = _a.componentName,
            args = _a.args;
          return (0, useLifecycleLogger_1.useLifecycleLogger)(
            componentName,
            args
          );
        },
        {
          initialProps: { args: { one: 1 }, componentName: "Test3" },
        }
      ),
      unmount = _a.unmount,
      rerender = _a.rerender;
    var newArguments = { one: 1, two: 2 };
    rerender({ args: newArguments, componentName: "Test3" });
    expect(logSpy).toHaveBeenLastCalledWith("Test3 updated", newArguments);
    unmount();
    expect(logSpy).toHaveBeenLastCalledWith("Test3 unmounted");
  });
});
// figure out tests
