import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useRafState } from "@/hooks/useRafState";

describe("useRafState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useRafState).toBeDefined();
  });

  it("should initialize with the given value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useRafState(42));
    expect(result.current[0]).toBe(42);
  });

  it("should initialize with a lazy initializer function", () => {
    expect.hasAssertions();
    const initializer = vi.fn(() => "hello");
    const { result } = renderHook(() => useRafState(initializer));
    expect(result.current[0]).toBe("hello");
    expect(initializer).toHaveBeenCalledTimes(1);
  });

  it("should return a stable setState function across re-renders", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(() => useRafState(0));
    const setStateBefore = result.current[1];
    rerender();
    const setStateAfter = result.current[1];
    expect(setStateBefore).toBe(setStateAfter);
  });

  it("should apply state update after the next animation frame", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useRafState(0));

    act(() => {
      result.current[1](99);
    });

    // Value not yet applied — rAF hasn't fired
    // (fake timers means rAF callback hasn't run synchronously)
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current[0]).toBe(99);
  });

  it("should only apply the last value when setState is called multiple times before the next frame", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useRafState(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[1](3);
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current[0]).toBe(3);
  });

  it("should support functional updater form", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useRafState(10));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current[0]).toBe(15);
  });

  it("should cancel pending rAF on unmount and not update state", () => {
    expect.hasAssertions();
    const { result, unmount } = renderHook(() => useRafState(0));
    const cancelSpy = vi.spyOn(globalThis, "cancelAnimationFrame");

    act(() => {
      result.current[1](100);
    });

    unmount();

    expect(cancelSpy).toHaveBeenCalled();
    cancelSpy.mockRestore();
  });

  it("should fall back to synchronous setState when requestAnimationFrame is undefined (SSR)", () => {
    expect.hasAssertions();
    const originalRaf = globalThis.requestAnimationFrame;
    // @ts-expect-error — simulating SSR environment
    delete globalThis.requestAnimationFrame;

    try {
      const { result } = renderHook(() => useRafState(0));

      act(() => {
        result.current[1](77);
      });

      // No rAF needed — state should be updated synchronously
      expect(result.current[0]).toBe(77);
    } finally {
      globalThis.requestAnimationFrame = originalRaf;
    }
  });

  it("should handle object state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useRafState<{ x: number; y: number }>({ x: 0, y: 0 })
    );

    act(() => {
      result.current[1]({ x: 100, y: 200 });
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current[0]).toEqual({ x: 100, y: 200 });
  });
});
