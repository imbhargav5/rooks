import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useRequest } from "@/hooks/useRequest";

function setHidden(hidden: boolean) {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: hidden,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("useRequest coverage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
  });

  it("rejects debounceWait combined with throttleWait", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      renderHook(() =>
        useRequest(async () => "x", {
          manual: true,
          debounceWait: 10,
          throttleWait: 10,
        })
      )
    ).toThrow(
      "useRequest does not support debounceWait and throttleWait together."
    );
  });

  it("cancel during a retry delay rejects the in-flight request", async () => {
    const service = vi.fn(async () => {
      throw new Error("boom");
    });
    const { result } = renderHook(() =>
      useRequest(service, { manual: true, retryCount: 2, retryInterval: 1000 })
    );
    let promise!: Promise<unknown>;
    const expectation = (async () => {
      promise = result.current.runAsync();
      await expect(promise).rejects.toThrow("Request cancelled");
    })();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });
    expect(service).toHaveBeenCalledTimes(1);
    act(() => {
      result.current.cancel();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    await expectation;
    expect(service).toHaveBeenCalledTimes(1);
  });

  it("surfaces an error thrown by a retryInterval function as the final error", async () => {
    const onError = vi.fn();
    const onFinally = vi.fn();
    const intervalError = new Error("bad interval");
    const { result } = renderHook(() =>
      useRequest(
        async () => {
          throw new Error("boom");
        },
        {
          manual: true,
          retryCount: 1,
          retryInterval: () => {
            throw intervalError;
          },
          onError,
          onFinally,
        }
      )
    );
    await act(async () => {
      await expect(result.current.runAsync()).rejects.toBe(intervalError);
    });
    expect(result.current.error).toBe(intervalError);
    expect(result.current.loading).toBe(false);
    expect(onError).toHaveBeenCalledWith(intervalError, []);
    expect(onFinally).toHaveBeenCalledWith([], undefined, intervalError);
  });

  it("uses a retryInterval function with attempt and error, and wraps non-Error rejections", async () => {
    const retryInterval = vi.fn(() => 5);
    let calls = 0;
    const { result } = renderHook(() =>
      useRequest(
        async () => {
          calls += 1;
          if (calls === 1) throw "string failure";
          return "ok";
        },
        { manual: true, retryCount: 1, retryInterval }
      )
    );
    const promise = result.current.runAsync();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20);
    });
    await expect(promise).resolves.toBe("ok");
    expect(retryInterval).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ message: "string failure" })
    );
  });

  it("keeps polling after a failed request", async () => {
    const service = vi.fn(async () => {
      throw new Error("nope");
    });
    renderHook(() =>
      useRequest(service, { manual: true, pollingInterval: 100 })
    ).result.current.run();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });
    expect(service).toHaveBeenCalledTimes(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(service).toHaveBeenCalledTimes(2);
  });

  it("coalesces throttled calls made while a trailing call is pending", async () => {
    const service = vi.fn(async (value: string) => value);
    const { result } = renderHook(() =>
      useRequest(service, { manual: true, throttleWait: 100 })
    );
    let second!: Promise<string>;
    let third!: Promise<string>;
    await act(async () => {
      await result.current.runAsync("a");
      second = result.current.runAsync("b");
      third = result.current.runAsync("c");
      await vi.advanceTimersByTimeAsync(200);
    });
    await expect(second).resolves.toBe("c");
    await expect(third).resolves.toBe("c");
    expect(service.mock.calls.map((c) => c[0])).toEqual(["a", "c"]);
  });

  it("debounces repeated calls into one with the latest args", async () => {
    const service = vi.fn(async (value: string) => value);
    const { result } = renderHook(() =>
      useRequest(service, { manual: true, debounceWait: 50 })
    );
    let p1!: Promise<string>;
    let p2!: Promise<string>;
    await act(async () => {
      p1 = result.current.runAsync("a");
      await vi.advanceTimersByTimeAsync(20);
      p2 = result.current.runAsync("b");
      await vi.advanceTimersByTimeAsync(100);
    });
    await expect(p1).resolves.toBe("b");
    await expect(p2).resolves.toBe("b");
    expect(service).toHaveBeenCalledTimes(1);
  });

  it("refreshAsync returns the initial data for a service that needs params", async () => {
    const service = vi.fn(async (id: string) => id);
    const { result } = renderHook(() =>
      useRequest(service, { manual: true, initialData: "seed" })
    );
    let value: unknown;
    await act(async () => {
      value = await result.current.refreshAsync();
    });
    expect(value).toBe("seed");
    expect(service).not.toHaveBeenCalled();
  });

  it("does not auto-run a service that needs params when none are provided", () => {
    const service = vi.fn(async (id: string) => id);
    renderHook(() => useRequest(service as any, {}));
    expect(service).not.toHaveBeenCalled();
  });

  it("skips a polling tick while hidden and resumes when visible again", async () => {
    const service = vi.fn(async () => "v");
    const { result } = renderHook(() =>
      useRequest(service, { manual: true, pollingInterval: 100 })
    );
    await act(async () => {
      result.current.run();
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(service).toHaveBeenCalledTimes(1);

    act(() => {
      setHidden(true);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(service).toHaveBeenCalledTimes(1);

    act(() => {
      setHidden(false);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(150);
    });
    expect(service).toHaveBeenCalledTimes(2);
  });

  it("does not execute a poll that fires after the document became hidden without an event", async () => {
    const service = vi.fn(async () => "v");
    const { result } = renderHook(() =>
      useRequest(service, { manual: true, pollingInterval: 100 })
    );
    await act(async () => {
      result.current.run();
      await vi.advanceTimersByTimeAsync(0);
    });
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(service).toHaveBeenCalledTimes(1);
  });

  it("reschedules polling when the polling interval changes", async () => {
    const service = vi.fn(async () => "v");
    const { result, rerender } = renderHook(
      ({ interval }) =>
        useRequest(service, { manual: true, pollingInterval: interval }),
      { initialProps: { interval: 1000 } }
    );
    await act(async () => {
      result.current.run();
      await vi.advanceTimersByTimeAsync(0);
    });
    rerender({ interval: 50 });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60);
    });
    expect(service).toHaveBeenCalledTimes(2);
  });

  it("cancels an active request when ready turns false", async () => {
    let resolve!: (v: string) => void;
    const service = vi.fn(
      () =>
        new Promise<string>((r) => {
          resolve = r;
        })
    );
    const { result, rerender } = renderHook(
      ({ ready }) => useRequest(service, { ready }),
      { initialProps: { ready: true } }
    );
    expect(result.current.loading).toBe(true);
    rerender({ ready: false });
    expect(result.current.loading).toBe(false);
    rerender({ ready: false });
    await act(async () => {
      resolve("late");
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.data).toBeUndefined();
  });

  it("re-runs automatically when default params change length or presence", async () => {
    const service = vi.fn(async (...args: string[]) => args.join(","));
    const { rerender } = renderHook(
      ({ params }: { params: string[] }) =>
        useRequest(service as (...a: string[]) => Promise<string>, {
          defaultParams: params as any,
        }),
      { initialProps: { params: ["a"] } }
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    rerender({ params: ["a", "b"] });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(service).toHaveBeenLastCalledWith("a", "b");
    expect(service).toHaveBeenCalledTimes(2);
  });

  it("refreshes when refreshDeps change", async () => {
    const service = vi.fn(async () => "v");
    const { rerender } = renderHook(
      ({ dep }) => useRequest(service, { refreshDeps: [dep] }),
      { initialProps: { dep: 1 } }
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    rerender({ dep: 2 });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(service).toHaveBeenCalledTimes(2);
  });
});
