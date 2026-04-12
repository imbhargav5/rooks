import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useRequest } from "../hooks/useRequest";

// ── Helpers ────────────────────────────────────────────────────────────────

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const noop = () => Promise.resolve("ok" as const);

// ── Suite ──────────────────────────────────────────────────────────────────

describe("useRequest", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // ── 1. Existence & shape ─────────────────────────────────────────────────

  it("is defined", () => {
    expect.hasAssertions();
    expect(useRequest).toBeDefined();
  });

  it("returns a tuple of [data, controls]", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useRequest(() => Promise.resolve(42), { manual: true })
    );
    const [data, controls] = result.current;

    expect(data).toBeUndefined();
    expect(controls).toMatchObject({
      loading: expect.any(Boolean),
      error: undefined,
      run: expect.any(Function),
      runAsync: expect.any(Function),
      refresh: expect.any(Function),
      refreshAsync: expect.any(Function),
      cancel: expect.any(Function),
      mutate: expect.any(Function),
    });
  });

  it("has loading=false and data=undefined before any run", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useRequest(() => Promise.resolve("hello"), { manual: true })
    );

    expect(result.current[0]).toBeUndefined();
    expect(result.current[1].loading).toBe(false);
    expect(result.current[1].error).toBeUndefined();
  });

  // ── 2. Auto-run (manual=false) ───────────────────────────────────────────

  it("runs the service automatically on mount when manual=false", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("auto");

    const { result } = renderHook(() => useRequest(service));

    expect(service).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current[0]).toBe("auto");
    expect(result.current[1].loading).toBe(false);
  });

  it("passes defaultParams to the auto-run", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("result");

    renderHook(() =>
      useRequest(service, { defaultParams: [1, "hello"] as [number, string] })
    );

    expect(service).toHaveBeenCalledWith(1, "hello");
  });

  it("does NOT run the service on mount when manual=true", () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("data");

    renderHook(() => useRequest(service, { manual: true }));

    expect(service).not.toHaveBeenCalled();
  });

  // ── 3. run / runAsync ────────────────────────────────────────────────────

  it("run: calls the service and updates data on success", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue(99);

    const { result } = renderHook(() =>
      useRequest(service, { manual: true })
    );

    act(() => {
      result.current[1].run();
    });

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current[0]).toBe(99);
    expect(result.current[1].loading).toBe(false);
    expect(result.current[1].error).toBeUndefined();
  });

  it("runAsync: resolves with data on success", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("resolved");

    const { result } = renderHook(() =>
      useRequest(service, { manual: true })
    );

    let resolved: string | undefined;
    await act(async () => {
      resolved = await result.current[1].runAsync();
    });

    expect(resolved).toBe("resolved");
  });

  it("runAsync: rejects with error on failure", async () => {
    expect.hasAssertions();
    const service = vi
      .fn()
      .mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() =>
      useRequest(service, { manual: true })
    );

    await act(async () => {
      await expect(result.current[1].runAsync()).rejects.toThrow("boom");
    });

    expect(result.current[1].error?.message).toBe("boom");
  });

  it("run: sets loading=true while request is in flight", async () => {
    expect.hasAssertions();
    const { promise, resolve } = deferred<string>();
    const service = vi.fn().mockReturnValue(promise);

    const { result } = renderHook(() =>
      useRequest(service, { manual: true })
    );

    act(() => {
      result.current[1].run();
    });

    expect(result.current[1].loading).toBe(true);

    await act(async () => {
      resolve("done");
      await promise;
    });

    expect(result.current[1].loading).toBe(false);
  });

  it("run: does not throw when the service rejects (fire-and-forget)", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockRejectedValue(new Error("silent"));

    const { result } = renderHook(() =>
      useRequest(service, { manual: true })
    );

    await act(async () => {
      // Should not throw
      result.current[1].run();
      await vi.runAllTimersAsync();
    });

    expect(result.current[1].error?.message).toBe("silent");
  });

  // ── 4. refresh / refreshAsync ─────────────────────────────────────────────

  it("refresh: re-runs the service with the last params", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("refreshed");

    const { result } = renderHook(() =>
      useRequest((x: number) => service(x), {
        manual: true,
      })
    );

    await act(async () => {
      await result.current[1].runAsync(7);
    });

    expect(service).toHaveBeenLastCalledWith(7);

    await act(async () => {
      result.current[1].refresh();
      await vi.runAllTimersAsync();
    });

    // Should have been called twice total, both with 7
    expect(service).toHaveBeenCalledTimes(2);
    expect(service).toHaveBeenLastCalledWith(7);
  });

  it("refreshAsync: returns a promise that resolves with the new data", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("newData");

    const { result } = renderHook(() => useRequest(service, { manual: true }));

    let val: string | undefined;
    await act(async () => {
      val = await result.current[1].refreshAsync();
    });

    expect(val).toBe("newData");
  });

  // ── 5. cancel ────────────────────────────────────────────────────────────

  it("cancel: clears loading state", async () => {
    expect.hasAssertions();
    const { promise } = deferred<string>();
    const service = vi.fn().mockReturnValue(promise);

    const { result } = renderHook(() =>
      useRequest(service, { manual: true })
    );

    act(() => {
      result.current[1].run();
    });

    expect(result.current[1].loading).toBe(true);

    act(() => {
      result.current[1].cancel();
    });

    expect(result.current[1].loading).toBe(false);
  });

  it("cancel: prevents stale responses from updating state", async () => {
    expect.hasAssertions();
    const { promise, resolve } = deferred<string>();
    const service = vi.fn().mockReturnValue(promise);

    const { result } = renderHook(() =>
      useRequest(service, { manual: true })
    );

    act(() => {
      result.current[1].run();
    });

    act(() => {
      result.current[1].cancel();
    });

    await act(async () => {
      resolve("stale");
      await promise;
    });

    // State should remain unchanged
    expect(result.current[0]).toBeUndefined();
  });

  // ── 6. mutate ────────────────────────────────────────────────────────────

  it("mutate: directly sets data with a value", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useRequest(() => Promise.resolve(1), { manual: true })
    );

    act(() => {
      result.current[1].mutate(42);
    });

    expect(result.current[0]).toBe(42);
  });

  it("mutate: accepts an updater function", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useRequest(() => Promise.resolve(1), { manual: true })
    );

    act(() => {
      result.current[1].mutate(10);
    });

    act(() => {
      result.current[1].mutate((prev) => (prev ?? 0) + 5);
    });

    expect(result.current[0]).toBe(15);
  });

  it("mutate: can set data to undefined", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useRequest(() => Promise.resolve("hi"), { manual: true })
    );

    act(() => {
      result.current[1].mutate("initial");
    });

    act(() => {
      result.current[1].mutate(undefined);
    });

    expect(result.current[0]).toBeUndefined();
  });

  // ── 7. Callbacks ─────────────────────────────────────────────────────────

  it("calls onBefore before the request", async () => {
    expect.hasAssertions();
    const onBefore = vi.fn();
    const service = vi.fn().mockResolvedValue("x");

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, onBefore })
    );

    await act(async () => {
      await result.current[1].runAsync(1, 2);
    });

    expect(onBefore).toHaveBeenCalledTimes(1);
    expect(onBefore).toHaveBeenCalledWith([1, 2]);
  });

  it("calls onSuccess with data and params on success", async () => {
    expect.hasAssertions();
    const onSuccess = vi.fn();
    const service = vi.fn().mockResolvedValue("result");

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, onSuccess })
    );

    await act(async () => {
      await result.current[1].runAsync("p");
    });

    expect(onSuccess).toHaveBeenCalledWith("result", ["p"]);
  });

  it("calls onError with error and params on failure", async () => {
    expect.hasAssertions();
    const onError = vi.fn();
    const err = new Error("fail");
    const service = vi.fn().mockRejectedValue(err);

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, onError })
    );

    await act(async () => {
      await result.current[1].runAsync("q").catch(() => {});
    });

    expect(onError).toHaveBeenCalledWith(err, ["q"]);
  });

  it("calls onFinally after success", async () => {
    expect.hasAssertions();
    const onFinally = vi.fn();
    const service = vi.fn().mockResolvedValue("done");

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, onFinally })
    );

    await act(async () => {
      await result.current[1].runAsync();
    });

    expect(onFinally).toHaveBeenCalledWith([], "done", undefined);
  });

  it("calls onFinally after failure", async () => {
    expect.hasAssertions();
    const onFinally = vi.fn();
    const err = new Error("oops");
    const service = vi.fn().mockRejectedValue(err);

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, onFinally })
    );

    await act(async () => {
      await result.current[1].runAsync().catch(() => {});
    });

    expect(onFinally).toHaveBeenCalledWith([], undefined, err);
  });

  it("does not call callbacks after cancel", async () => {
    expect.hasAssertions();
    const { promise, resolve } = deferred<string>();
    const onSuccess = vi.fn();
    const onFinally = vi.fn();
    const service = vi.fn().mockReturnValue(promise);

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, onSuccess, onFinally })
    );

    act(() => {
      result.current[1].run();
    });

    act(() => {
      result.current[1].cancel();
    });

    await act(async () => {
      resolve("too late");
      await promise;
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
  });

  it("does not update state after unmount", async () => {
    expect.hasAssertions();
    const { promise, resolve } = deferred<string>();
    const service = vi.fn().mockReturnValue(promise);

    const { result, unmount } = renderHook(() =>
      useRequest(service, { manual: true })
    );

    act(() => {
      result.current[1].run();
    });

    unmount();

    await act(async () => {
      resolve("post-unmount");
      await promise;
    });

    // After unmount the hook state is frozen at its last value.
    expect(result.current[0]).toBeUndefined();
  });

  // ── 8. retryCount / retryInterval ────────────────────────────────────────

  it("retries the service retryCount times before giving up", async () => {
    expect.hasAssertions();
    const service = vi
      .fn()
      .mockRejectedValue(new Error("retry-fail"));

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, retryCount: 2, retryInterval: 100 })
    );

    const runPromise = result.current[1].runAsync().catch(() => {});

    // 2 retries = 2 intervals of 100ms each
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    await act(async () => {
      await runPromise;
    });

    expect(service).toHaveBeenCalledTimes(3); // 1 original + 2 retries
    expect(result.current[1].error?.message).toBe("retry-fail");
  });

  it("resolves successfully on a later retry attempt", async () => {
    expect.hasAssertions();
    const service = vi
      .fn()
      .mockRejectedValueOnce(new Error("first fail"))
      .mockResolvedValue("ok");

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, retryCount: 1, retryInterval: 50 })
    );

    const runPromise = result.current[1].runAsync().catch(() => {});

    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });

    await act(async () => {
      await runPromise;
    });

    expect(service).toHaveBeenCalledTimes(2);
    expect(result.current[0]).toBe("ok");
    expect(result.current[1].error).toBeUndefined();
  });

  // ── 9. loadingDelay ───────────────────────────────────────────────────────

  it("loadingDelay: does not show loading before the delay elapses", async () => {
    expect.hasAssertions();
    const { promise, resolve } = deferred<string>();
    const service = vi.fn().mockReturnValue(promise);

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, loadingDelay: 300 })
    );

    act(() => {
      result.current[1].run();
    });

    // Before the delay: loading should still be false
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current[1].loading).toBe(false);

    // After the delay: loading becomes true
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current[1].loading).toBe(true);

    await act(async () => {
      resolve("fast");
      await promise;
    });
    expect(result.current[1].loading).toBe(false);
  });

  it("loadingDelay: never shows loading if request resolves before delay", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("quick");

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, loadingDelay: 500 })
    );

    await act(async () => {
      await result.current[1].runAsync();
      // Advance past the delay to make sure the timer was cleared
      vi.advanceTimersByTime(500);
    });

    expect(result.current[1].loading).toBe(false);
    expect(result.current[0]).toBe("quick");
  });

  // ── 10. pollingInterval ───────────────────────────────────────────────────

  it("pollingInterval: re-runs the service after success", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("poll");

    // Use manual=true so we can explicitly await the initial run without
    // hitting the vi.runAllTimersAsync() infinite-loop problem that arises
    // when polling keeps scheduling new timers.
    const { result } = renderHook(() =>
      useRequest(service, { manual: true, pollingInterval: 1000 })
    );

    // Explicit initial run
    await act(async () => {
      await result.current[1].runAsync();
    });
    expect(service).toHaveBeenCalledTimes(1);

    // Advance by exactly one poll interval; advanceTimersByTimeAsync fires
    // the poll timer and awaits the resulting runAsync() promise.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(service).toHaveBeenCalledTimes(2);
    expect(result.current[0]).toBe("poll");
  });

  it("pollingInterval: stops polling after cancel", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("poll");

    const { result } = renderHook(() =>
      useRequest(service, { manual: true, pollingInterval: 500 })
    );

    await act(async () => {
      await result.current[1].runAsync();
    });
    expect(service).toHaveBeenCalledTimes(1);

    act(() => {
      result.current[1].cancel();
    });

    // Advancing past the poll interval should not trigger another call
    // because cancel() cleared the polling timer.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    // Should still be 1 — no more polls after cancel
    expect(service).toHaveBeenCalledTimes(1);
  });

  // ── 11. refreshDeps ───────────────────────────────────────────────────────

  it("refreshDeps: re-runs when a dep changes, not on mount", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("dep-data");

    let dep = 0;
    const { rerender } = renderHook(() =>
      useRequest(service, { manual: true, refreshDeps: [dep] })
    );

    // The hook is manual, so service should NOT be called on mount.
    expect(service).not.toHaveBeenCalled();

    dep = 1;
    rerender();

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(service).toHaveBeenCalledTimes(1);
  });

  // ── 12. Cleanup on unmount ────────────────────────────────────────────────

  it("clears polling timer on unmount", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("x");

    const { result, unmount } = renderHook(() =>
      useRequest(service, { manual: true, pollingInterval: 500 })
    );

    // Explicit initial run so the poll timer gets scheduled.
    await act(async () => {
      await result.current[1].runAsync();
    });

    unmount();

    const callsAtUnmount = service.mock.calls.length;

    // Advancing past the poll interval should not trigger another call
    // because unmount cleans up the polling timer.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    // No additional calls after unmount
    expect(service.mock.calls.length).toBe(callsAtUnmount);
  });
});
