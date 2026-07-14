import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useRequest } from "@/hooks/useRequest";

type Deferred<T> = {
  promise: Promise<T>;
  reject: (reason?: unknown) => void;
  resolve: (value: T) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return {
    promise,
    reject,
    resolve,
  };
}

const valueCases = Array.from({ length: 10 }, (_, index) => ({
  first: `first-${index}`,
  second: `second-${index}`,
  value: `value-${index}`,
  wait: index + 5,
}));

describe("useRequest matrix", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
  });

  it.each(valueCases)(
    "manual runAsync resolves and stores params for $value",
    async ({ value }) => {
      expect.hasAssertions();
      const service = vi.fn(async (param: string) => `${param}:done`);
      const { result } = renderHook(() => useRequest(service, { manual: true }));

      await act(async () => {
        await result.current.runAsync(value);
      });

      expect(service).toHaveBeenCalledWith(value);
      expect(result.current.data).toBe(`${value}:done`);
      expect(result.current.params).toEqual([value]);
    }
  );

  it.each(valueCases)(
    "auto-runs once with default params for $value",
    async ({ value }) => {
      expect.hasAssertions();
      const service = vi.fn(async (param: string) => `${param}:auto`);
      const { result } = renderHook(() =>
        useRequest(service, {
          defaultParams: [value],
        })
      );

      await waitFor(() => {
        expect(result.current.data).toBe(`${value}:auto`);
      });

      expect(service).toHaveBeenCalledTimes(1);
      expect(service).toHaveBeenCalledWith(value);
    }
  );

  it.each(valueCases)(
    "later invocation wins for $first -> $second",
    async ({ first, second }) => {
      expect.hasAssertions();
      const deferredMap = new Map<string, Deferred<string>>();
      const service = vi.fn((param: string) => {
        const deferred = createDeferred<string>();
        deferredMap.set(param, deferred);
        return deferred.promise;
      });
      const { result } = renderHook(() => useRequest(service, { manual: true }));

      const firstPromise = result.current.runAsync(first);
      const secondPromise = result.current.runAsync(second);
      const firstExpectation = expect(firstPromise).rejects.toThrow(
        "Request cancelled"
      );
      const secondExpectation = expect(secondPromise).resolves.toBe(
        `${second}:done`
      );

      await act(async () => {
        deferredMap.get(first)!.resolve(`${first}:done`);
        await Promise.resolve();
      });
      await firstExpectation;

      await act(async () => {
        deferredMap.get(second)!.resolve(`${second}:done`);
        await Promise.resolve();
      });
      await secondExpectation;

      expect(result.current.data).toBe(`${second}:done`);
    }
  );

  it.each(valueCases)(
    "debounce coalesces calls and resolves all callers with the latest args for wait $wait",
    async ({ first, second, wait }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      const service = vi.fn(async (param: string) => `${param}:debounced`);
      const { result } = renderHook(() =>
        useRequest(service, {
          manual: true,
          debounceWait: wait,
        })
      );

      const firstPromise = result.current.runAsync(first);
      const secondPromise = result.current.runAsync(second);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(wait);
      });

      await expect(firstPromise).resolves.toBe(`${second}:debounced`);
      await expect(secondPromise).resolves.toBe(`${second}:debounced`);

      expect(service).toHaveBeenCalledTimes(1);
      expect(service).toHaveBeenCalledWith(second);
    }
  );

  it.each(valueCases)(
    "throttle runs immediately and schedules a trailing call for wait $wait",
    async ({ first, second, wait }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      const service = vi.fn(async (param: string) => `${param}:throttled`);
      const { result } = renderHook(() =>
        useRequest(service, {
          manual: true,
          throttleWait: wait,
        })
      );

      const firstPromise = result.current.runAsync(first);
      const secondPromise = result.current.runAsync(second);

      await expect(firstPromise).resolves.toBe(`${first}:throttled`);
      expect(service).toHaveBeenCalledTimes(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(wait);
      });

      await expect(secondPromise).resolves.toBe(`${second}:throttled`);
      expect(service).toHaveBeenCalledTimes(2);
      expect(service).toHaveBeenLastCalledWith(second);
    }
  );

  it.each(
    valueCases.slice(0, 5).map(({ value, wait }, index) => ({
      delay: wait + 10,
      fast: true,
      value,
      wait: index + 1,
    })).concat(
      valueCases.slice(5).map(({ value, wait }, index) => ({
        delay: wait + 10,
        fast: false,
        value,
        wait: wait + index + 5,
      }))
    )
  )(
    "loadingDelay handles $value with fast=$fast",
    async ({ delay, fast, value, wait }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      const deferred = createDeferred<string>();
      const service = vi.fn(async () => {
        if (fast) {
          return `${value}:fast`;
        }

        return deferred.promise;
      });
      const { result } = renderHook(() =>
        useRequest(service, {
          manual: true,
          loadingDelay: delay,
        })
      );

      const promise = result.current.runAsync(value);

      if (fast) {
        await expect(promise).resolves.toBe(`${value}:fast`);
        expect(result.current.loading).toBe(false);
      } else {
        await act(async () => {
          await vi.advanceTimersByTimeAsync(delay);
        });
        expect(result.current.loading).toBe(true);

        await act(async () => {
          deferred.resolve(`${value}:slow`);
          await Promise.resolve();
        });
        await expect(promise).resolves.toBe(`${value}:slow`);
        expect(result.current.loading).toBe(false);
      }

      expect(wait).toBeGreaterThan(0);
    }
  );

  it.each(valueCases.slice(0, 5))(
    "retries failed requests with numeric intervals for $value",
    async ({ value, wait }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      const service = vi
        .fn()
        .mockRejectedValueOnce(new Error("retry"))
        .mockResolvedValueOnce(`${value}:retried`);
      const { result } = renderHook(() =>
        useRequest(service, {
          manual: true,
          retryCount: 1,
          retryInterval: wait,
        })
      );

      const promise = result.current.runAsync(value);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(wait);
      });

      await expect(promise).resolves.toBe(`${value}:retried`);
      expect(service).toHaveBeenCalledTimes(2);
      expect(result.current.data).toBe(`${value}:retried`);
    }
  );

  it.each(valueCases.slice(5))(
    "retries failed requests with interval functions for $value",
    async ({ value, wait }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      const retryInterval = vi.fn(() => wait);
      const service = vi
        .fn()
        .mockRejectedValueOnce(new Error("retry"))
        .mockResolvedValueOnce(`${value}:retried`);
      const { result } = renderHook(() =>
        useRequest(service, {
          manual: true,
          retryCount: 1,
          retryInterval,
        })
      );

      const promise = result.current.runAsync(value);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(wait);
      });

      await expect(promise).resolves.toBe(`${value}:retried`);
      expect(retryInterval).toHaveBeenCalledTimes(1);
      expect(service).toHaveBeenCalledTimes(2);
      expect(result.current.data).toBe(`${value}:retried`);
    }
  );

  it.each(valueCases.slice(0, 5))(
    "polls again while visible for $value",
    async ({ value, wait }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      const service = vi.fn(async () => `${value}:poll`);
      renderHook(() =>
        useRequest(service, {
          defaultParams: [value],
          pollingInterval: wait,
        })
      );

      await act(async () => {
        await Promise.resolve();
      });
      expect(service).toHaveBeenCalledTimes(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(wait);
        await Promise.resolve();
      });

      expect(service).toHaveBeenCalledTimes(2);
    }
  );

  it.each(valueCases.slice(5))(
    "suppresses polling while hidden for $value",
    async ({ value, wait }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      Object.defineProperty(document, "hidden", {
        configurable: true,
        value: true,
      });
      const service = vi.fn(async () => `${value}:poll`);
      renderHook(() =>
        useRequest(service, {
          defaultParams: [value],
          pollingInterval: wait,
          pollingWhenHidden: false,
        })
      );

      await act(async () => {
        await Promise.resolve();
      });
      expect(service).toHaveBeenCalledTimes(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(wait * 2);
        await Promise.resolve();
      });

      expect(service).toHaveBeenCalledTimes(1);
    }
  );

  it.each(valueCases.slice(0, 5))(
    "cancel rejects debounced requests before they start for $value",
    async ({ value, wait }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      const service = vi.fn(async () => `${value}:cancelled`);
      const { result } = renderHook(() =>
        useRequest(service, {
          manual: true,
          debounceWait: wait,
        })
      );

      const promise = result.current.runAsync(value);
      const rejectionExpectation = expect(promise).rejects.toThrow(
        "Request cancelled"
      );

      act(() => {
        result.current.cancel();
      });

      await expect(promise).rejects.toThrow("Request cancelled");
      expect(service).not.toHaveBeenCalled();
    }
  );

  it.each(valueCases.slice(5))(
    "cancel rejects in-flight requests for $value",
    async ({ value }) => {
      expect.hasAssertions();
      const deferred = createDeferred<string>();
      const service = vi.fn(() => deferred.promise);
      const { result } = renderHook(() =>
        useRequest(service, {
          manual: true,
        })
      );

      const promise = result.current.runAsync(value);
      const rejectionExpectation = expect(promise).rejects.toThrow(
        "Request cancelled"
      );

      act(() => {
        result.current.cancel();
      });

      await act(async () => {
        deferred.resolve(`${value}:late`);
        await Promise.resolve();
      });
      await rejectionExpectation;
      expect(result.current.data).toBeUndefined();
      expect(result.current.loading).toBe(false);
    }
  );

  it.each(
    valueCases.map(({ value }, index) => ({
      callbackValue: value,
      mode: index,
    }))
  )(
    "handles readiness, refresh, mutate, and callbacks scenario $mode for $callbackValue",
    async ({ callbackValue, mode }) => {
      expect.hasAssertions();
      const events: string[] = [];
      const service = vi.fn(async (value: string) => `${value}:handled`);
      const refreshDeps = [mode % 2];
      const { result, rerender } = renderHook(
        ({ ready, dep }) =>
          useRequest(service, {
            defaultParams: [callbackValue],
            ready,
            refreshDeps: [dep],
            onBefore: (params) => {
              events.push(`before:${params[0]}`);
            },
            onSuccess: (data) => {
              events.push(`success:${data}`);
            },
            onFinally: () => {
              events.push("finally");
            },
          }),
        {
          initialProps: {
            ready: mode % 3 === 0 ? false : true,
            dep: refreshDeps[0],
          },
        }
      );

      if (mode % 3 === 0) {
        expect(service).toHaveBeenCalledTimes(0);
        rerender({ ready: true, dep: refreshDeps[0] });
      }

      await waitFor(() => {
        expect(result.current.data).toBe(`${callbackValue}:handled`);
      });

      act(() => {
        result.current.mutate(`${callbackValue}:mutated`);
      });
      expect(result.current.data).toBe(`${callbackValue}:mutated`);

      rerender({ ready: true, dep: refreshDeps[0] + 1 });

      await waitFor(() => {
        expect(service).toHaveBeenCalled();
      });

      await act(async () => {
        await result.current.refreshAsync();
      });

      expect(events.some((event) => event.startsWith("before:"))).toBe(true);
      expect(events.some((event) => event.startsWith("success:"))).toBe(true);
      expect(events.includes("finally")).toBe(true);
    }
  );
});
