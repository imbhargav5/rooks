import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLockFn } from "@/hooks/useLockFn";

describe("useLockFn", () => {
  it("is defined", () => {
    expect.hasAssertions();
    expect(useLockFn).toBeDefined();
  });

  it("should return a function", () => {
    expect.hasAssertions();
    const fn = vi.fn().mockResolvedValue("result");
    const { result } = renderHook(() => useLockFn(fn));
    expect(typeof result.current).toBe("function");
  });

  it("should call fn and return its result", async () => {
    expect.hasAssertions();
    const fn = vi.fn().mockResolvedValue("result");
    const { result } = renderHook(() => useLockFn(fn));

    let returnValue: string | undefined;
    await act(async () => {
      returnValue = await result.current();
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe("result");
  });

  it("should pass arguments to fn", async () => {
    expect.hasAssertions();
    const fn = vi.fn().mockResolvedValue("ok");
    const { result } = renderHook(() =>
      useLockFn(fn as (...args: unknown[]) => Promise<string>)
    );

    await act(async () => {
      await result.current("arg1", 42, true);
    });

    expect(fn).toHaveBeenCalledWith("arg1", 42, true);
  });

  it("should prevent concurrent calls while first is in-flight", async () => {
    expect.hasAssertions();
    let resolveFirst!: (value: string) => void;
    const firstPromise = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });
    const fn = vi.fn().mockReturnValue(firstPromise);
    const { result } = renderHook(() => useLockFn(fn));

    let firstReturn: string | undefined;
    let secondReturn: string | undefined;

    await act(async () => {
      const firstCall = result.current();
      const secondCall = result.current();

      resolveFirst("first");

      [firstReturn, secondReturn] = await Promise.all([firstCall, secondCall]);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(firstReturn).toBe("first");
    expect(secondReturn).toBeUndefined();
  });

  it("should allow a new call after the previous one completes", async () => {
    expect.hasAssertions();
    const fn = vi.fn().mockResolvedValue("result");
    const { result } = renderHook(() => useLockFn(fn));

    await act(async () => {
      await result.current();
    });

    await act(async () => {
      await result.current();
    });

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should release lock even when fn throws", async () => {
    expect.hasAssertions();
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("first failed"))
      .mockResolvedValueOnce("second succeeded");
    const { result } = renderHook(() => useLockFn(fn));

    await act(async () => {
      try {
        await result.current();
      } catch {
        // expected rejection
      }
    });

    let returnValue: string | undefined;
    await act(async () => {
      returnValue = await result.current();
    });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(returnValue).toBe("second succeeded");
  });

  it("should block all concurrent calls, not just the second", async () => {
    expect.hasAssertions();
    let resolveFirst!: (value: string) => void;
    const firstPromise = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });
    const fn = vi.fn().mockReturnValue(firstPromise);
    const { result } = renderHook(() => useLockFn(fn));

    let results: Array<string | undefined> = [];

    await act(async () => {
      const calls = [
        result.current(),
        result.current(),
        result.current(),
        result.current(),
      ];
      resolveFirst("only-one");
      results = await Promise.all(calls);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(results[0]).toBe("only-one");
    expect(results[1]).toBeUndefined();
    expect(results[2]).toBeUndefined();
    expect(results[3]).toBeUndefined();
  });

  it("should use the latest version of fn without re-creating the wrapper", async () => {
    expect.hasAssertions();
    const fn1 = vi.fn().mockResolvedValue("from-fn1");
    const fn2 = vi.fn().mockResolvedValue("from-fn2");

    const { result, rerender } = renderHook(
      ({ fn }) => useLockFn(fn),
      { initialProps: { fn: fn1 } }
    );

    const wrappedBefore = result.current;

    rerender({ fn: fn2 });

    // The wrapper identity should remain stable
    expect(result.current).toBe(wrappedBefore);

    let returnValue: string | undefined;
    await act(async () => {
      returnValue = await result.current();
    });

    // Should have called the latest fn (fn2), not the stale fn1
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe("from-fn2");
  });

  it("should clean up lock ref on unmount", async () => {
    expect.hasAssertions();
    let resolveFirst!: (value: string) => void;
    const firstPromise = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });
    const fn = vi.fn().mockReturnValue(firstPromise);
    const { result, unmount } = renderHook(() => useLockFn(fn));

    // Start a call but don't await it yet
    let firstCallPromise: Promise<string | undefined>;
    act(() => {
      firstCallPromise = result.current();
    });

    // Unmount while the call is still in-flight
    unmount();

    // Resolve the underlying promise after unmount
    await act(async () => {
      resolveFirst("value");
      await firstCallPromise;
    });

    // No errors should be thrown; the lock was cleared on unmount
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
