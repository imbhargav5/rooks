import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLockFn } from "@/hooks/useLockFn";

describe("useLockFn", () => {
  it("is defined", () => {
    expect.hasAssertions();
    expect(useLockFn).toBeDefined();
  });

  it("returns a tuple of [function, boolean]", () => {
    expect.hasAssertions();
    const mockFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useLockFn(mockFn));

    expect(typeof result.current[0]).toBe("function");
    expect(typeof result.current[1]).toBe("boolean");
  });

  it("initially isLocked is false", () => {
    expect.hasAssertions();
    const mockFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useLockFn(mockFn));

    expect(result.current[1]).toBe(false);
  });

  it("calls the wrapped function when invoked", async () => {
    expect.hasAssertions();
    const mockFn = vi.fn().mockResolvedValue("result");
    const { result } = renderHook(() => useLockFn(mockFn));

    await act(async () => {
      await result.current[0]("arg1", "arg2");
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("sets isLocked to true while the async function is running", async () => {
    expect.hasAssertions();
    let resolvePromise: () => void;
    const pendingPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    const mockFn = vi.fn().mockReturnValue(pendingPromise);
    const { result } = renderHook(() => useLockFn(mockFn));

    expect(result.current[1]).toBe(false);

    act(() => {
      void result.current[0]();
    });

    expect(result.current[1]).toBe(true);

    await act(async () => {
      resolvePromise!();
      await pendingPromise;
    });

    expect(result.current[1]).toBe(false);
  });

  it("prevents concurrent execution — second call is ignored while locked", async () => {
    expect.hasAssertions();
    let resolveFirst: () => void;
    const firstPromise = new Promise<void>((resolve) => {
      resolveFirst = resolve;
    });
    const mockFn = vi.fn().mockReturnValueOnce(firstPromise).mockResolvedValue(undefined);
    const { result } = renderHook(() => useLockFn(mockFn));

    // Start first call — locks the function
    act(() => {
      void result.current[0]("first");
    });

    expect(result.current[1]).toBe(true);

    // Second call while locked — should be a no-op
    act(() => {
      void result.current[0]("second");
    });

    // Only one invocation so far
    expect(mockFn).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveFirst!();
      await firstPromise;
    });

    // Still only one invocation after the lock is released
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("first");
    expect(result.current[1]).toBe(false);
  });

  it("unlocks after async function resolves, allowing subsequent calls", async () => {
    expect.hasAssertions();
    const mockFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useLockFn(mockFn));

    await act(async () => {
      await result.current[0]("call1");
    });

    expect(result.current[1]).toBe(false);
    expect(mockFn).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current[0]("call2");
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(1, "call1");
    expect(mockFn).toHaveBeenNthCalledWith(2, "call2");
  });

  it("unlocks even when the async function throws", async () => {
    expect.hasAssertions();
    const error = new Error("async failure");
    const mockFn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useLockFn(mockFn));

    await act(async () => {
      // swallow the error; the lock must still be released
      await result.current[0]().catch(() => undefined);
    });

    expect(result.current[1]).toBe(false);

    // Function should be callable again after the error
    const mockFn2 = vi.fn().mockResolvedValue(undefined);
    const { result: result2 } = renderHook(() => useLockFn(mockFn2));
    await act(async () => {
      await result2.current[0]("after-error");
    });
    expect(mockFn2).toHaveBeenCalledWith("after-error");
  });

  it("does not re-execute while locked even after multiple rapid calls", async () => {
    expect.hasAssertions();
    let resolvePromise: () => void;
    const pendingPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    const mockFn = vi.fn().mockReturnValue(pendingPromise);
    const { result } = renderHook(() => useLockFn(mockFn));

    // Fire many calls while the first is pending
    act(() => {
      void result.current[0]();
      void result.current[0]();
      void result.current[0]();
      void result.current[0]();
    });

    // All extra calls are dropped; only the first one ran
    expect(mockFn).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolvePromise!();
      await pendingPromise;
    });

    expect(result.current[1]).toBe(false);
  });

  it("passes all arguments through to the wrapped function", async () => {
    expect.hasAssertions();
    const mockFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useLockFn(mockFn));

    await act(async () => {
      await result.current[0](1, "two", { three: 3 });
    });

    expect(mockFn).toHaveBeenCalledWith(1, "two", { three: 3 });
  });
});
