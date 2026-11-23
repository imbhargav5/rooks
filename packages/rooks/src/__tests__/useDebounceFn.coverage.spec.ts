import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounceFn } from "@/hooks/useDebounceFn";

describe("useDebounceFn coverage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("throws when both leading and trailing are false", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      renderHook(() =>
        useDebounceFn(() => {}, 100, { leading: false, trailing: false })
      )
    ).toThrow("leading and trailing cannot both be false");
  });

  it("throws when maxWait is less than delay", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      renderHook(() =>
        useDebounceFn(() => {}, 100, { trailing: true, maxWait: 50 })
      )
    ).toThrow("maxWait cannot be less than delay");
  });

  it("leading only: calls immediately once, ignores calls while waiting", () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebounceFn(fn, 100, { leading: true, trailing: false })
    );
    act(() => result.current[0]("a"));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a");
    act(() => result.current[0]("b"));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("leading and trailing: fires on both edges with latest args", () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebounceFn(fn, 100, { leading: true, trailing: true })
    );
    act(() => result.current[0]("a"));
    act(() => result.current[0]("b"));
    expect(fn).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("b");
    expect(result.current[1]).toBe(false);
  });

  it("trailing with maxWait fires at maxWait while calls keep resetting", () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebounceFn(fn, 100, { trailing: true, maxWait: 250 })
    );
    for (let i = 0; i < 4; i++) {
      act(() => result.current[0](i));
      act(() => {
        vi.advanceTimersByTime(80);
      });
    }
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(fn).toHaveBeenLastCalledWith(3);
  });

  it("leading with maxWait re-fires after maxWait elapsed during continuous calls", () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebounceFn(fn, 100, { leading: true, trailing: true, maxWait: 200 })
    );
    act(() => result.current[0]("a"));
    expect(fn).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(50);
    });
    act(() => result.current[0]("b"));
    vi.setSystemTime(Date.now() + 300);
    act(() => result.current[0]("c"));
    expect(fn).toHaveBeenCalledWith("c");
  });

  it("leading with maxWait and no pending timeout fires again after maxWait", () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebounceFn(fn, 100, { leading: true, trailing: false, maxWait: 200 })
    );
    act(() => result.current[0]("a"));
    vi.setSystemTime(Date.now() + 500);
    act(() => result.current[0]("b"));
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("leading+trailing with maxWait fires leading again after a completed cycle and maxWait elapsed", () => {
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDebounceFn(fn, 100, { leading: true, trailing: true, maxWait: 200 })
    );
    act(() => result.current[0]("a"));
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current[1]).toBe(false);
    const callsBefore = fn.mock.calls.length;
    vi.setSystemTime(Date.now() + 1000);
    act(() => result.current[0]("b"));
    expect(fn.mock.calls.length).toBe(callsBefore + 1);
    expect(fn).toHaveBeenLastCalledWith("b");
  });

  it("catches and warns on errors thrown by the callback", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const err = new Error("boom");
    const fn = vi.fn(() => {
      throw err;
    });
    const { result } = renderHook(() =>
      useDebounceFn(fn, 100, { leading: true, trailing: true })
    );
    act(() => result.current[0]());
    expect(warn).toHaveBeenCalledWith(err);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("catches errors in maxWait trailing path", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fn = vi.fn(() => {
      throw new Error("x");
    });
    const { result } = renderHook(() =>
      useDebounceFn(fn, 100, { trailing: true, maxWait: 100 })
    );
    act(() => result.current[0]());
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(warn).toHaveBeenCalled();
  });
});
