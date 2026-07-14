import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useRequest } from "@/hooks/useRequest";

describe("useRequest", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("runs requests manually and stores the result", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("done");
    const { result } = renderHook(() => useRequest(service, { manual: true }));

    await act(async () => {
      await result.current.runAsync();
    });

    expect(service).toHaveBeenCalledTimes(1);
    expect(result.current.data).toBe("done");
    expect(result.current.loading).toBe(false);
  });

  it("auto-runs with default params once on mount", async () => {
    expect.hasAssertions();
    const service = vi.fn().mockResolvedValue("ready");

    const { result } = renderHook(() =>
      useRequest(service, {
        defaultParams: ["hooks"],
      })
    );

    await waitFor(() => {
      expect(result.current.data).toBe("ready");
    });

    expect(service).toHaveBeenCalledTimes(1);
    expect(service).toHaveBeenCalledWith("hooks");
  });

  it("retries failed requests", async () => {
    expect.hasAssertions();
    vi.useFakeTimers();
    const service = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce("success");
    const { result } = renderHook(() =>
      useRequest(service, {
        manual: true,
        retryCount: 1,
        retryInterval: 10,
      })
    );

    const promise = act(async () => {
      const requestPromise = result.current.runAsync();
      await vi.advanceTimersByTimeAsync(10);
      await requestPromise;
    });

    await promise;

    expect(service).toHaveBeenCalledTimes(2);
    expect(result.current.data).toBe("success");
  });

  it("can cancel in-flight requests without committing state", async () => {
    expect.hasAssertions();
    let resolveRequest: ((value: string) => void) | null = null;
    const service = vi.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolveRequest = resolve;
        })
    );
    const { result } = renderHook(() =>
      useRequest(service, {
        manual: true,
      })
    );

    act(() => {
      result.current.run();
    });

    act(() => {
      result.current.cancel();
    });

    await act(async () => {
      resolveRequest?.("ignored");
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });

  it("rejects in-flight requests after unmount without firing success callbacks", async () => {
    expect.hasAssertions();
    let resolveRequest: ((value: string) => void) | null = null;
    const onFinally = vi.fn();
    const onSuccess = vi.fn();
    const service = vi.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolveRequest = resolve;
        })
    );
    const { result, unmount } = renderHook(() =>
      useRequest(service, {
        manual: true,
        onFinally,
        onSuccess,
      })
    );

    const promise = result.current.runAsync();
    const rejectionExpectation = expect(promise).rejects.toThrow(
      "Request cancelled"
    );

    unmount();

    await act(async () => {
      resolveRequest?.("ignored");
      await Promise.resolve();
    });

    await rejectionExpectation;
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
  });
});
