import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useRequest } from "@/hooks/useRequest";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeService<T>(value: T, delayMs = 0) {
  return vi.fn(
    (): Promise<T> =>
      new Promise((resolve) => {
        if (delayMs > 0) {
          setTimeout(() => resolve(value), delayMs);
        } else {
          resolve(value);
        }
      })
  );
}

function makeErrorService(message = "request failed", delayMs = 0) {
  return vi.fn(
    (): Promise<never> =>
      new Promise((_, reject) => {
        if (delayMs > 0) {
          setTimeout(() => reject(new Error(message)), delayMs);
        } else {
          reject(new Error(message));
        }
      })
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useRequest", () => {
  it("is defined", () => {
    expect.hasAssertions();
    expect(useRequest).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // Auto-trigger
  // -------------------------------------------------------------------------

  describe("auto-trigger (manual=false)", () => {
    it("starts with loading=true", () => {
      expect.hasAssertions();
      const service = makeService("data", 100);
      const { result } = renderHook(() => useRequest(service));
      expect(result.current.loading).toBe(true);
    });

    it("resolves data and clears loading on success", async () => {
      expect.hasAssertions();
      const service = makeService("hello");
      const { result } = renderHook(() => useRequest(service));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe("hello");
      expect(result.current.error).toBeUndefined();
      expect(service).toHaveBeenCalledTimes(1);
    });

    it("sets error and clears loading on failure", async () => {
      expect.hasAssertions();
      const service = makeErrorService("boom");
      const { result } = renderHook(() => useRequest(service));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error?.message).toBe("boom");
    });

    it("passes defaultParams to the service", async () => {
      expect.hasAssertions();
      const service = vi.fn(
        (id: number): Promise<string> => Promise.resolve(`user-${id}`)
      );
      const { result } = renderHook(() =>
        useRequest(service, { defaultParams: [42] })
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(service).toHaveBeenCalledWith(42);
      expect(result.current.data).toBe("user-42");
    });
  });

  // -------------------------------------------------------------------------
  // Manual mode
  // -------------------------------------------------------------------------

  describe("manual=true", () => {
    it("does not fetch on mount", () => {
      expect.hasAssertions();
      const service = makeService("data");
      const { result } = renderHook(() =>
        useRequest(service, { manual: true })
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(service).not.toHaveBeenCalled();
    });

    it("fetches when run() is called", async () => {
      expect.hasAssertions();
      const service = makeService("manual-data");
      const { result } = renderHook(() =>
        useRequest(service, { manual: true })
      );

      act(() => {
        result.current.run();
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.data).toBe("manual-data");
    });

    it("fetches when runAsync() is called", async () => {
      expect.hasAssertions();
      const service = makeService(99);
      const { result } = renderHook(() =>
        useRequest(service, { manual: true })
      );

      let resolved: number | undefined;
      await act(async () => {
        resolved = await result.current.runAsync();
      });

      expect(resolved).toBe(99);
      expect(result.current.data).toBe(99);
      expect(result.current.loading).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // run() with params
  // -------------------------------------------------------------------------

  describe("run() with params", () => {
    it("passes params to the service", async () => {
      expect.hasAssertions();
      const service = vi.fn(
        (a: string, b: number): Promise<string> =>
          Promise.resolve(`${a}-${b}`)
      );
      const { result } = renderHook(() =>
        useRequest(service, { manual: true })
      );

      act(() => {
        result.current.run("foo", 7);
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(service).toHaveBeenCalledWith("foo", 7);
      expect(result.current.data).toBe("foo-7");
      expect(result.current.params).toEqual(["foo", 7]);
    });
  });

  // -------------------------------------------------------------------------
  // Callbacks
  // -------------------------------------------------------------------------

  describe("callbacks", () => {
    it("calls onSuccess with data and params", async () => {
      expect.hasAssertions();
      const onSuccess = vi.fn();
      const service = vi.fn((x: number) => Promise.resolve(x * 2));

      const { result } = renderHook(() =>
        useRequest(service, { manual: true, onSuccess })
      );

      act(() => {
        result.current.run(5);
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(onSuccess).toHaveBeenCalledWith(10, [5]);
    });

    it("calls onError with error and params", async () => {
      expect.hasAssertions();
      const onError = vi.fn();
      const service = vi.fn((_x: number) =>
        Promise.reject(new Error("oops"))
      );

      const { result } = renderHook(() =>
        useRequest(service, { manual: true, onError })
      );

      act(() => {
        result.current.run(3);
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(onError).toHaveBeenCalledWith(expect.any(Error), [3]);
      expect(onError.mock.calls[0]?.[0].message).toBe("oops");
    });

    it("calls onFinally on success", async () => {
      expect.hasAssertions();
      const onFinally = vi.fn();
      const service = makeService("done");

      const { result } = renderHook(() =>
        useRequest(service, { manual: true, onFinally })
      );

      act(() => result.current.run());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(onFinally).toHaveBeenCalledTimes(1);
      expect(onFinally).toHaveBeenCalledWith([], "done", undefined);
    });

    it("calls onFinally on error", async () => {
      expect.hasAssertions();
      const onFinally = vi.fn();
      const service = makeErrorService("fail");

      const { result } = renderHook(() =>
        useRequest(service, { manual: true, onFinally })
      );

      act(() => result.current.run());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(onFinally).toHaveBeenCalledTimes(1);
      expect(onFinally).toHaveBeenCalledWith(
        [],
        undefined,
        expect.any(Error)
      );
    });
  });

  // -------------------------------------------------------------------------
  // refresh / refreshAsync
  // -------------------------------------------------------------------------

  describe("refresh", () => {
    it("re-runs with last params", async () => {
      expect.hasAssertions();
      const service = vi.fn((x: number) => Promise.resolve(x + 1));

      const { result } = renderHook(() =>
        useRequest(service, { manual: true })
      );

      act(() => result.current.run(10));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toBe(11);
      expect(service).toHaveBeenCalledTimes(1);

      act(() => result.current.refresh());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(service).toHaveBeenCalledTimes(2);
      expect(service).toHaveBeenLastCalledWith(10);
    });

    it("refreshAsync returns a promise that resolves with new data", async () => {
      expect.hasAssertions();
      let counter = 0;
      const service = vi.fn((): Promise<number> => Promise.resolve(++counter));

      const { result } = renderHook(() =>
        useRequest(service, { manual: true })
      );

      act(() => result.current.run());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toBe(1);

      let refreshed: number | undefined;
      await act(async () => {
        refreshed = await result.current.refreshAsync();
      });
      expect(refreshed).toBe(2);
      expect(result.current.data).toBe(2);
    });
  });

  // -------------------------------------------------------------------------
  // mutate
  // -------------------------------------------------------------------------

  describe("mutate", () => {
    it("sets data directly to a new value", async () => {
      expect.hasAssertions();
      const service = makeService("original");
      const { result } = renderHook(() => useRequest(service));

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toBe("original");

      act(() => result.current.mutate("overridden"));
      expect(result.current.data).toBe("overridden");
    });

    it("accepts an updater function", async () => {
      expect.hasAssertions();
      const service = makeService(5);
      const { result } = renderHook(() => useRequest(service));

      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => result.current.mutate((old) => (old ?? 0) * 10));
      expect(result.current.data).toBe(50);
    });
  });

  // -------------------------------------------------------------------------
  // cancel
  // -------------------------------------------------------------------------

  describe("cancel", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("sets loading=false immediately", async () => {
      expect.hasAssertions();
      const service = makeService("late", 500);
      const { result } = renderHook(() => useRequest(service));

      // loading starts true
      expect(result.current.loading).toBe(true);

      act(() => result.current.cancel());
      expect(result.current.loading).toBe(false);
    });

    it("does not update data after cancel", async () => {
      expect.hasAssertions();
      const service = makeService("should-not-arrive", 200);
      const { result } = renderHook(() => useRequest(service));

      act(() => result.current.cancel());
      expect(result.current.data).toBeUndefined();

      // Advance past the service delay to make sure nothing arrives
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current.data).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Retry
  // -------------------------------------------------------------------------

  describe("retryCount", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("retries the specified number of times before failing", async () => {
      expect.hasAssertions();
      const service = makeErrorService("transient");

      const { result } = renderHook(() =>
        useRequest(service, {
          manual: true,
          retryCount: 2,
          retryInterval: 100,
        })
      );

      act(() => result.current.run());

      // Flush first failure (synchronous rejection, resolved via microtask)
      await act(async () => {
        await Promise.resolve();
      });

      // Advance through first retry interval and flush
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      // Advance through second retry interval and flush
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(service).toHaveBeenCalledTimes(3); // 1 original + 2 retries
      expect(result.current.loading).toBe(false);
      expect(result.current.error?.message).toBe("transient");
    });

    it("succeeds on a later retry", async () => {
      expect.hasAssertions();
      let attempts = 0;
      const service = vi.fn((): Promise<string> => {
        attempts++;
        if (attempts < 3) return Promise.reject(new Error("not yet"));
        return Promise.resolve("success-on-retry");
      });

      const { result } = renderHook(() =>
        useRequest(service, {
          manual: true,
          retryCount: 3,
          retryInterval: 50,
        })
      );

      act(() => result.current.run());

      // Flush first failure
      await act(async () => {
        await Promise.resolve();
      });

      // Advance through first retry
      await act(async () => {
        await vi.advanceTimersByTimeAsync(50);
      });

      // Advance through second retry (this one succeeds)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(50);
      });

      expect(service).toHaveBeenCalledTimes(3);
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("success-on-retry");
      expect(result.current.error).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Debounce
  // -------------------------------------------------------------------------

  describe("debounceWait", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("coalesces rapid calls into one request", async () => {
      expect.hasAssertions();
      const service = makeService("debounced");

      const { result } = renderHook(() =>
        useRequest(service, { manual: true, debounceWait: 200 })
      );

      act(() => {
        result.current.run();
        result.current.run();
        result.current.run();
      });

      // No call yet — still within debounce window
      expect(service).not.toHaveBeenCalled();

      // Advance past the debounce window and flush promises
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });

      expect(service).toHaveBeenCalledTimes(1);
      expect(result.current.loading).toBe(false);
    });

    it("uses the last params when debouncing multiple calls", async () => {
      expect.hasAssertions();
      const service = vi.fn((x: number) => Promise.resolve(x));

      const { result } = renderHook(() =>
        useRequest(service, { manual: true, debounceWait: 150 })
      );

      act(() => {
        result.current.run(1);
        result.current.run(2);
        result.current.run(3);
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(150);
      });

      expect(service).toHaveBeenCalledTimes(1);
      expect(service).toHaveBeenCalledWith(3);
      expect(result.current.loading).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // Polling
  // -------------------------------------------------------------------------

  describe("pollingInterval", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("re-triggers the request at the specified interval", async () => {
      expect.hasAssertions();
      const service = makeService("poll");

      renderHook(() => useRequest(service, { pollingInterval: 1000 }));

      // Flush the initial auto-trigger (runs via useEffect + Promise microtask)
      await act(async () => {
        await Promise.resolve();
      });
      expect(service).toHaveBeenCalledTimes(1);

      // Advance one polling interval
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
      expect(service).toHaveBeenCalledTimes(2);

      // Advance another polling interval
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
      expect(service).toHaveBeenCalledTimes(3);
    });

    it("stops polling on unmount", async () => {
      expect.hasAssertions();
      const service = makeService("poll");

      const { unmount } = renderHook(() =>
        useRequest(service, { pollingInterval: 500 })
      );

      // Flush initial auto-trigger
      await act(async () => {
        await Promise.resolve();
      });
      expect(service).toHaveBeenCalledTimes(1);

      unmount();
      const countAfterUnmount = service.mock.calls.length;

      // Advance well past several polling intervals
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000);
      });
      expect(service).toHaveBeenCalledTimes(countAfterUnmount);
    });
  });

  // -------------------------------------------------------------------------
  // Caching
  // -------------------------------------------------------------------------

  describe("cacheKey + staleTime", () => {
    it("returns cached data without re-fetching within staleTime", async () => {
      expect.hasAssertions();
      const service = makeService("cached-value");
      const key = `test-cache-${Date.now()}`;

      // First hook instance — triggers a real request
      const { result: first } = renderHook(() =>
        useRequest(service, { cacheKey: key, staleTime: 60_000 })
      );
      await waitFor(() => expect(first.current.loading).toBe(false));
      expect(first.current.data).toBe("cached-value");
      expect(service).toHaveBeenCalledTimes(1);

      // Second hook instance — should hit the in-memory cache
      const { result: second } = renderHook(() =>
        useRequest(service, { cacheKey: key, staleTime: 60_000 })
      );

      // Data should be available immediately, loading should be false
      expect(second.current.data).toBe("cached-value");
      expect(second.current.loading).toBe(false);

      // Service should still have been called only once (cache hit)
      expect(service).toHaveBeenCalledTimes(1);
    });

    it("re-fetches when staleTime=0 (default)", async () => {
      expect.hasAssertions();
      const service = makeService("fresh");
      const key = `test-no-cache-${Date.now()}`;

      const { result: first } = renderHook(() =>
        useRequest(service, { cacheKey: key, staleTime: 0 })
      );
      await waitFor(() => expect(first.current.loading).toBe(false));

      const { result: second } = renderHook(() =>
        useRequest(service, { cacheKey: key, staleTime: 0 })
      );
      await waitFor(() => expect(second.current.loading).toBe(false));

      // Both instances should have triggered a fetch
      expect(service).toHaveBeenCalledTimes(2);
    });
  });

  // -------------------------------------------------------------------------
  // Cleanup on unmount
  // -------------------------------------------------------------------------

  describe("cleanup", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("does not update state after unmount", async () => {
      expect.hasAssertions();
      const service = makeService("late-data", 300);
      const { result, unmount } = renderHook(() => useRequest(service));

      expect(result.current.loading).toBe(true);
      unmount();

      // Advancing past service delay should not cause errors
      await act(async () => vi.advanceTimersByTime(400));
      // No assertion — absence of act() warnings / exceptions is the goal
    });

    it("clears pending retry timers on unmount", async () => {
      expect.hasAssertions();
      const service = makeErrorService("persistent");

      const { result, unmount } = renderHook(() =>
        useRequest(service, {
          manual: true,
          retryCount: 5,
          retryInterval: 1000,
        })
      );

      act(() => result.current.run());

      // Let the first attempt fail via microtask
      await act(async () => {
        await Promise.resolve();
      });

      // Unmount while the first retry timer (1000ms) is still pending
      unmount();

      // Advancing well past all retry intervals should not trigger more calls
      await act(async () => {
        await vi.advanceTimersByTimeAsync(6000);
      });

      // Only the initial attempt should have run before unmount cancelled retries
      expect(service).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // Error cleared on next run
  // -------------------------------------------------------------------------

  describe("error state lifecycle", () => {
    it("clears error when a subsequent request succeeds", async () => {
      expect.hasAssertions();
      let fail = true;
      const service = vi.fn((): Promise<string> => {
        if (fail) return Promise.reject(new Error("temporary error"));
        return Promise.resolve("recovered");
      });

      const { result } = renderHook(() =>
        useRequest(service, { manual: true })
      );

      // First call — fails
      act(() => result.current.run());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error?.message).toBe("temporary error");

      // Second call — succeeds
      fail = false;
      act(() => result.current.run());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBeUndefined();
      expect(result.current.data).toBe("recovered");
    });
  });

  // -------------------------------------------------------------------------
  // params tracking
  // -------------------------------------------------------------------------

  describe("params tracking", () => {
    it("exposes params from the last run call", async () => {
      expect.hasAssertions();
      const service = vi.fn(
        (a: string, b: number) => Promise.resolve(`${a}:${b}`)
      );

      const { result } = renderHook(() =>
        useRequest(service, { manual: true })
      );

      act(() => result.current.run("hello", 42));
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.params).toEqual(["hello", 42]);
    });
  });
});
