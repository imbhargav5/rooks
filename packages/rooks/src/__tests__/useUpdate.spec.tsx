import { act, renderHook } from "@testing-library/react";
import { useUpdate } from "../hooks/useUpdate";

describe("useUpdate", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useUpdate).toBeDefined();
  });

  it("should return a function", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useUpdate());

    expect(typeof result.current).toBe("function");
  });

  it("should trigger a re-render when called", () => {
    expect.hasAssertions();
    let renderCount = 0;

    const { result } = renderHook(() => {
      renderCount++;
      return useUpdate();
    });

    const countAfterMount = renderCount;

    act(() => {
      result.current();
    });

    expect(renderCount).toBeGreaterThan(countAfterMount);
  });

  it("should trigger multiple re-renders on multiple calls", () => {
    expect.hasAssertions();
    let renderCount = 0;

    const { result } = renderHook(() => {
      renderCount++;
      return useUpdate();
    });

    const countAfterMount = renderCount;

    act(() => {
      result.current();
    });
    act(() => {
      result.current();
    });

    expect(renderCount).toBeGreaterThanOrEqual(countAfterMount + 2);
  });

  it("should maintain a stable function reference across re-renders", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(() => useUpdate());

    const initialUpdate = result.current;

    rerender();

    expect(result.current).toBe(initialUpdate);
  });

  it("should maintain a stable function reference after calling update", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useUpdate());

    const updateBeforeCall = result.current;

    act(() => {
      result.current();
    });

    expect(result.current).toBe(updateBeforeCall);
  });

  it("should work correctly when called in rapid succession", () => {
    expect.hasAssertions();
    let renderCount = 0;

    const { result } = renderHook(() => {
      renderCount++;
      return useUpdate();
    });

    const countAfterMount = renderCount;

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    expect(renderCount).toBeGreaterThan(countAfterMount);
  });
});
