import { renderHook, act } from "@testing-library/react";
import { StrictMode } from "react";
import { vi } from "vitest";
import { useDisposable } from "@/hooks/useDisposable";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeResource() {
  const dispose = vi.fn();
  const resource: Disposable & { dispose: typeof dispose } = {
    [Symbol.dispose]: dispose,
    dispose,
  };
  return resource;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useDisposable", () => {
  it("is defined", () => {
    expect.hasAssertions();
    expect(useDisposable).toBeDefined();
  });

  it("creates the resource synchronously so it is available on first render", () => {
    expect.hasAssertions();
    const resource = makeResource();
    const factory = vi.fn(() => resource);

    const { result } = renderHook(() => useDisposable(factory));

    expect(factory).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(resource);
  });

  it("disposes the resource when the component unmounts", () => {
    expect.hasAssertions();
    const resource = makeResource();

    const { unmount } = renderHook(() => useDisposable(() => resource));

    expect(resource.dispose).not.toHaveBeenCalled();
    unmount();
    expect(resource.dispose).toHaveBeenCalledTimes(1);
  });

  it("does not call dispose before unmount", () => {
    expect.hasAssertions();
    const resource = makeResource();

    const { rerender } = renderHook(() => useDisposable(() => resource));

    rerender();
    rerender();
    expect(resource.dispose).not.toHaveBeenCalled();
  });

  it("does not recreate the resource on unrelated rerenders", () => {
    expect.hasAssertions();
    const resource = makeResource();
    const factory = vi.fn(() => resource);

    const { result, rerender } = renderHook(() => useDisposable(factory));
    const initialResource = result.current;
    rerender();
    rerender();

    expect(result.current).toBe(initialResource);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(resource.dispose).not.toHaveBeenCalled();
  });

  it("disposes the old resource and creates a new one when deps change", async () => {
    expect.hasAssertions();
    let callCount = 0;
    const resources = [makeResource(), makeResource()];
    const factory = vi.fn(() => {
      const r = resources[callCount];
      callCount += 1;
      return r!;
    });

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    expect(result.current).toBe(resources[0]);

    rerender({ dep: 2 });

    // After the deps change the old resource should have been disposed and the
    // component should have received the new resource (the hook schedules a
    // forceUpdate after recreating in the effect).
    await act(async () => {
      // flush the forceUpdate microtask
    });

    expect(factory).toHaveBeenCalledTimes(2);
    expect(resources[0]!.dispose).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(resources[1]);
    expect(resources[1]!.dispose).not.toHaveBeenCalled();
  });

  it("throws if the factory fails on initial render", () => {
    expect.hasAssertions();
    const error = new Error("initial factory failure");
    const factory = vi.fn(() => {
      throw error;
    });

    expect(() => renderHook(() => useDisposable(factory))).toThrow(error);
    expect(factory).toHaveBeenCalled();
  });

  it("disposes the previous resource before surfacing a dep-driven factory failure", () => {
    expect.hasAssertions();
    const resource = makeResource();
    const error = new Error("replacement factory failure");
    const factory = vi
      .fn<() => ReturnType<typeof makeResource>>()
      .mockReturnValueOnce(resource)
      .mockImplementationOnce(() => {
        throw error;
      });

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    expect(result.current).toBe(resource);

    expect(() => rerender({ dep: 2 })).toThrow(error);
    expect(factory).toHaveBeenCalledTimes(2);
    expect(resource.dispose).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(resource);
  });

  it("propagates Symbol.dispose errors during dep changes and keeps the old resource", () => {
    expect.hasAssertions();
    const disposeError = new Error("dispose failure");
    const resource = {
      [Symbol.dispose]: vi.fn(() => {
        throw disposeError;
      }),
    } as Disposable;
    const replacement = makeResource();
    const factory = vi
      .fn<() => Disposable>()
      .mockReturnValueOnce(resource)
      .mockReturnValueOnce(replacement);

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    expect(result.current).toBe(resource);

    let thrown: unknown;
    try {
      rerender({ dep: 2 });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(AggregateError);
    expect((thrown as AggregateError).errors).toEqual([
      disposeError,
      disposeError,
    ]);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(resource);
  });

  it("disposes the final resource on unmount after a deps change", async () => {
    expect.hasAssertions();
    let callCount = 0;
    const resources = [makeResource(), makeResource()];
    const factory = vi.fn(() => {
      const r = resources[callCount];
      callCount += 1;
      return r!;
    });

    const { rerender, unmount } = renderHook(
      ({ dep }: { dep: number }) => useDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    rerender({ dep: 2 });

    await act(async () => {});

    unmount();

    expect(resources[0]!.dispose).toHaveBeenCalledTimes(1);
    expect(resources[1]!.dispose).toHaveBeenCalledTimes(1);
  });

  it("does not dispose new resource on a dep change that was not yet reflected", () => {
    expect.hasAssertions();
    const resources = [makeResource(), makeResource()];
    let callCount = 0;
    const factory = vi.fn(() => {
      const r = resources[callCount];
      callCount += 1;
      return r!;
    });

    const { rerender } = renderHook(
      ({ dep }: { dep: number }) => useDisposable(factory, [dep]),
      { initialProps: { dep: 1 } }
    );

    rerender({ dep: 2 });

    // resources[1] should not have been disposed yet
    expect(resources[1]!.dispose).not.toHaveBeenCalled();
  });

  it("handles React Strict Mode: disposes Strict Mode resource and keeps live resource", async () => {
    expect.hasAssertions();
    const createdResources: ReturnType<typeof makeResource>[] = [];
    const factory = vi.fn(() => {
      const r = makeResource();
      createdResources.push(r);
      return r;
    });

    const { result, unmount } = renderHook(() => useDisposable(factory), {
      wrapper: StrictMode,
    });

    // Wait for effects + forceUpdate flush
    await act(async () => {});

    // factory is called twice: once on the initial render and once on the
    // Strict Mode remount render (after cleanup nulls the ref).
    expect(factory).toHaveBeenCalledTimes(2);

    // The first resource was disposed by the Strict Mode cleanup.
    expect(createdResources[0]!.dispose).toHaveBeenCalledTimes(1);

    // The second resource is the live one — not yet disposed.
    expect(createdResources[1]!.dispose).not.toHaveBeenCalled();

    // The hook returns the live resource.
    expect(result.current).toBe(createdResources[1]);

    unmount();
    expect(createdResources[1]!.dispose).toHaveBeenCalledTimes(1);
  });

  it("with empty deps, only disposes on unmount (not on rerenders)", () => {
    expect.hasAssertions();
    const resource = makeResource();
    const factory = vi.fn(() => resource);

    const { rerender, unmount } = renderHook(() =>
      useDisposable(factory, [])
    );

    rerender();
    rerender();
    expect(resource.dispose).not.toHaveBeenCalled();

    unmount();
    expect(resource.dispose).toHaveBeenCalledTimes(1);
  });
});
