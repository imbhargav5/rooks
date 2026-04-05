import { renderHook, act } from "@testing-library/react";
import { StrictMode } from "react";
import { vi } from "vitest";
import { useAsyncDisposable } from "@/hooks/useAsyncDisposable";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeAsyncResource() {
  const asyncDispose = vi.fn().mockResolvedValue(undefined);
  const resource: AsyncDisposable & { asyncDispose: typeof asyncDispose } = {
    [Symbol.asyncDispose]: asyncDispose,
    asyncDispose,
  };
  return resource;
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function captureNextUnhandledRejection() {
  return new Promise<unknown>((resolve) => {
    process.once("unhandledRejection", resolve);
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useAsyncDisposable", () => {
  it("is defined", () => {
    expect.hasAssertions();
    expect(useAsyncDisposable).toBeDefined();
  });

  it("returns null before the factory resolves", async () => {
    expect.hasAssertions();
    const deferred = createDeferred<ReturnType<typeof makeAsyncResource>>();

    const { result } = renderHook(() =>
      useAsyncDisposable(() => deferred.promise)
    );

    expect(result.current).toBeNull();

    // resolve the factory
    const resource = makeAsyncResource();
    await act(async () => {
      deferred.resolve(resource);
    });

    expect(result.current).toBe(resource);
  });

  it("returns the resource after the factory resolves", async () => {
    expect.hasAssertions();
    const resource = makeAsyncResource();

    const { result } = renderHook(() =>
      useAsyncDisposable(() => Promise.resolve(resource))
    );

    await act(async () => {});

    expect(result.current).toBe(resource);
  });

  it("stays null when the factory rejects", async () => {
    expect.hasAssertions();
    const error = new Error("factory rejection");
    const rejectedPromise = Promise.reject(error);
    const unhandledRejection = captureNextUnhandledRejection();
    const factory = vi.fn(() => rejectedPromise);

    const { result } = renderHook(() => useAsyncDisposable(factory));

    expect(result.current).toBeNull();

    await act(async () => {});

    await expect(unhandledRejection).resolves.toBe(error);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(result.current).toBeNull();
  });

  it("disposes the resource when the component unmounts", async () => {
    expect.hasAssertions();
    const resource = makeAsyncResource();

    const { unmount } = renderHook(() =>
      useAsyncDisposable(() => Promise.resolve(resource))
    );

    await act(async () => {});

    expect(resource.asyncDispose).not.toHaveBeenCalled();
    unmount();
    expect(resource.asyncDispose).toHaveBeenCalledTimes(1);
  });

  it("disposes old resource and creates new one when deps change", async () => {
    expect.hasAssertions();
    let callCount = 0;
    const resources = [makeAsyncResource(), makeAsyncResource()];
    const factory = vi.fn(() => {
      const r = resources[callCount];
      callCount += 1;
      return Promise.resolve(r!);
    });

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useAsyncDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    await act(async () => {});
    expect(result.current).toBe(resources[0]);

    rerender({ dep: 2 });
    // state is reset to null immediately by the cleanup
    expect(result.current).toBeNull();

    await act(async () => {});

    expect(factory).toHaveBeenCalledTimes(2);
    expect(resources[0]!.asyncDispose).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(resources[1]);
    expect(resources[1]!.asyncDispose).not.toHaveBeenCalled();
  });

  it("continues dep-driven replacement when Symbol.asyncDispose rejects during cleanup", async () => {
    expect.hasAssertions();
    const disposeError = new Error("async dispose rejection");
    const disposeRejection = Promise.reject(disposeError);
    void disposeRejection.catch(() => {});
    const resources = [makeAsyncResource(), makeAsyncResource()];
    resources[0]!.asyncDispose.mockReturnValueOnce(disposeRejection);
    let callCount = 0;
    const factory = vi.fn(() => Promise.resolve(resources[callCount++]!));

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useAsyncDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    await act(async () => {});
    expect(result.current).toBe(resources[0]);

    rerender({ dep: 2 });
    expect(result.current).toBeNull();

    await act(async () => {});

    await expect(disposeRejection).rejects.toBe(disposeError);
    expect(resources[0]!.asyncDispose).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(resources[1]);
  });

  it("returns null between a deps change and the new factory resolving", async () => {
    expect.hasAssertions();
    const deferred1 = createDeferred<ReturnType<typeof makeAsyncResource>>();
    const deferred2 = createDeferred<ReturnType<typeof makeAsyncResource>>();
    let callCount = 0;
    const deferreds = [deferred1, deferred2];
    const factory = vi.fn(() => {
      const d = deferreds[callCount];
      callCount += 1;
      return d!.promise;
    });

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useAsyncDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    // Resolve first factory
    const resource1 = makeAsyncResource();
    await act(async () => {
      deferred1.resolve(resource1);
    });
    expect(result.current).toBe(resource1);

    // Change deps — cleanup resets to null immediately
    rerender({ dep: 2 });
    expect(result.current).toBeNull();

    // Second factory still pending — still null
    expect(result.current).toBeNull();

    // Resolve second factory
    const resource2 = makeAsyncResource();
    await act(async () => {
      deferred2.resolve(resource2);
    });
    expect(result.current).toBe(resource2);
  });

  it("race condition: disposes resource immediately if component unmounts while factory is resolving", async () => {
    expect.hasAssertions();
    const deferred = createDeferred<ReturnType<typeof makeAsyncResource>>();

    const { result, unmount } = renderHook(() =>
      useAsyncDisposable(() => deferred.promise)
    );

    // Factory still pending
    expect(result.current).toBeNull();

    // Unmount before factory resolves
    unmount();

    // Now factory resolves — resource should be disposed immediately
    const resource = makeAsyncResource();
    await act(async () => {
      deferred.resolve(resource);
    });

    // Component never received the resource
    expect(result.current).toBeNull();
    // Resource was disposed immediately
    expect(resource.asyncDispose).toHaveBeenCalledTimes(1);
  });

  it("race condition: disposes stale resource if deps change while factory is resolving", async () => {
    expect.hasAssertions();
    const deferred1 = createDeferred<ReturnType<typeof makeAsyncResource>>();
    const deferred2 = createDeferred<ReturnType<typeof makeAsyncResource>>();
    let callCount = 0;
    const deferreds = [deferred1, deferred2];
    const factory = vi.fn(() => {
      const d = deferreds[callCount];
      callCount += 1;
      return d!.promise;
    });

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useAsyncDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    // Deps change before first factory resolves
    rerender({ dep: 2 });

    // First factory resolves — should be disposed, component should not see it
    const resource1 = makeAsyncResource();
    await act(async () => {
      deferred1.resolve(resource1);
    });
    expect(resource1.asyncDispose).toHaveBeenCalledTimes(1);
    expect(result.current).toBeNull();

    // Second factory resolves — component should see this one
    const resource2 = makeAsyncResource();
    await act(async () => {
      deferred2.resolve(resource2);
    });
    expect(result.current).toBe(resource2);
    expect(resource2.asyncDispose).not.toHaveBeenCalled();
  });

  it("only commits the latest resource across three rapid dep changes with out-of-order resolutions", async () => {
    expect.hasAssertions();
    const deferreds = [
      createDeferred<ReturnType<typeof makeAsyncResource>>(),
      createDeferred<ReturnType<typeof makeAsyncResource>>(),
      createDeferred<ReturnType<typeof makeAsyncResource>>(),
      createDeferred<ReturnType<typeof makeAsyncResource>>(),
    ];
    let callCount = 0;
    const factory = vi.fn(() => deferreds[callCount++]!.promise);

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useAsyncDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    rerender({ dep: 2 });
    rerender({ dep: 3 });
    rerender({ dep: 4 });
    expect(result.current).toBeNull();

    const resource1 = makeAsyncResource();
    const resource2 = makeAsyncResource();
    const resource3 = makeAsyncResource();
    const resource4 = makeAsyncResource();

    await act(async () => {
      deferreds[1]!.resolve(resource2);
    });
    expect(resource2.asyncDispose).toHaveBeenCalledTimes(1);
    expect(result.current).toBeNull();

    await act(async () => {
      deferreds[0]!.resolve(resource1);
    });
    expect(resource1.asyncDispose).toHaveBeenCalledTimes(1);
    expect(result.current).toBeNull();

    await act(async () => {
      deferreds[3]!.resolve(resource4);
    });
    expect(result.current).toBe(resource4);
    expect(resource4.asyncDispose).not.toHaveBeenCalled();

    await act(async () => {
      deferreds[2]!.resolve(resource3);
    });
    expect(resource3.asyncDispose).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(resource4);
    expect(factory).toHaveBeenCalledTimes(4);
  });

  it("does not let a stale async result overwrite a newer resolved resource", async () => {
    expect.hasAssertions();
    const deferred1 = createDeferred<ReturnType<typeof makeAsyncResource>>();
    const deferred2 = createDeferred<ReturnType<typeof makeAsyncResource>>();
    let callCount = 0;
    const deferreds = [deferred1, deferred2];
    const factory = vi.fn(() => deferreds[callCount++]!.promise);

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useAsyncDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    rerender({ dep: 2 });

    const newerResource = makeAsyncResource();
    await act(async () => {
      deferred2.resolve(newerResource);
    });
    expect(result.current).toBe(newerResource);

    const staleResource = makeAsyncResource();
    await act(async () => {
      deferred1.resolve(staleResource);
    });

    expect(staleResource.asyncDispose).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(newerResource);
  });

  it("handles React Strict Mode: disposes Strict Mode resource and keeps live resource", async () => {
    expect.hasAssertions();
    const createdResources: ReturnType<typeof makeAsyncResource>[] = [];
    const factory = vi.fn(() => {
      const r = makeAsyncResource();
      createdResources.push(r);
      return Promise.resolve(r);
    });

    const { result, unmount } = renderHook(() => useAsyncDisposable(factory), {
      wrapper: StrictMode,
    });

    await act(async () => {});

    // factory called twice: once per mount in Strict Mode
    expect(factory).toHaveBeenCalledTimes(2);

    // First resource was disposed by the Strict Mode cleanup
    expect(createdResources[0]!.asyncDispose).toHaveBeenCalledTimes(1);

    // Second resource is the live one
    expect(createdResources[1]!.asyncDispose).not.toHaveBeenCalled();
    expect(result.current).toBe(createdResources[1]);

    unmount();
    expect(createdResources[1]!.asyncDispose).toHaveBeenCalledTimes(1);
  });

  it("with empty deps, factory is only called once", async () => {
    expect.hasAssertions();
    const resource = makeAsyncResource();
    const factory = vi.fn(() => Promise.resolve(resource));

    const { rerender } = renderHook(() =>
      useAsyncDisposable(factory, [])
    );

    await act(async () => {});
    rerender();
    rerender();

    expect(factory).toHaveBeenCalledTimes(1);
  });
});
