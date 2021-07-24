/**
 * @jest-environment jsdom
 */
import { renderHook, cleanup } from "@testing-library/react-hooks";
import { useLifecycleLogger } from "../hooks/useLifecycleLogger";

const logSpy = jest.spyOn(global.console, "log").mockImplementation(() => {});
describe("useLifecycleLogger", () => {
  afterEach(() => {
    logSpy.mockClear();
    cleanup();
  });

  it("should be defined", () => {
    expect(useLifecycleLogger).toBeDefined();
  });
  it("should work without arguments", () => {
    const { unmount } = renderHook(() => useLifecycleLogger());

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenLastCalledWith("Component mounted");
    unmount();
    expect(logSpy).toHaveBeenCalledTimes(2);
  });
  it("should log the provided args on mount", () => {
    const args = ["foo", "bar"];
    const { unmount } = renderHook(() => useLifecycleLogger("Test1", args));

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenLastCalledWith("Test1 mounted", args);
    unmount();
    expect(logSpy).toHaveBeenCalledTimes(2);
  });

  it("should log when the component has unmounted", () => {
    const args = ["foo", "bar"];
    const { unmount } = renderHook(() => useLifecycleLogger("Test2", args));

    unmount();

    expect(logSpy).toHaveBeenLastCalledWith("Test2 unmounted");
  });

  it("should log updates as args change", () => {
    const { unmount, rerender } = renderHook(
      ({ componentName, args }) => useLifecycleLogger(componentName, args),
      {
        initialProps: { args: { one: 1 }, componentName: "Test3" },
      }
    );

    const newArguments = { one: 1, two: 2 };
    rerender({ args: newArguments, componentName: "Test3" });

    expect(logSpy).toHaveBeenLastCalledWith("Test3 updated", newArguments);
    unmount();

    expect(logSpy).toHaveBeenLastCalledWith("Test3 unmounted");
  });
});

// figure out tests
