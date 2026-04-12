import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../hooks/usePagination";
import type { PaginationService } from "../hooks/usePagination";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Item = { id: number; label: string };

function makeItems(count: number, offset = 0): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: offset + i + 1,
    label: `item-${offset + i + 1}`,
  }));
}

function makeMockService(
  total: number,
  latency = 0
): PaginationService<Item> {
  return vi.fn(
    ({ current, pageSize }: { current: number; pageSize: number }) => {
      const offset = (current - 1) * pageSize;
      const list = makeItems(Math.min(pageSize, total - offset), offset);
      const response = { total, list };

      if (latency === 0) {
        return Promise.resolve(response);
      }
      return new Promise((resolve) =>
        setTimeout(() => resolve(response), latency)
      );
    }
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("usePagination", () => {
  it("should be defined", () => {
    expect(usePagination).toBeDefined();
  });

  it("should return the correct shape", () => {
    const service = makeMockService(0);
    const { result } = renderHook(() =>
      usePagination(service, { manual: true })
    );

    const [paginationData, controls] = result.current;

    // paginationData shape
    expect(paginationData).toMatchObject({
      data: [],
      total: 0,
      current: 1,
      pageSize: 10,
      totalPage: 0,
      loading: false,
      error: null,
    });

    // controls shape
    expect(typeof controls.onChange).toBe("function");
    expect(typeof controls.changeCurrent).toBe("function");
    expect(typeof controls.changePageSize).toBe("function");
    expect(typeof controls.reload).toBe("function");
    expect(typeof controls.run).toBe("function");
    expect(typeof controls.cancel).toBe("function");
  });

  it("should respect defaultCurrent and defaultPageSize", () => {
    const service = makeMockService(0);
    const { result } = renderHook(() =>
      usePagination(service, {
        manual: true,
        defaultCurrent: 3,
        defaultPageSize: 25,
      })
    );

    const [{ current, pageSize }] = result.current;
    expect(current).toBe(3);
    expect(pageSize).toBe(25);
  });

  // -------------------------------------------------------------------------
  // Auto-fetch
  // -------------------------------------------------------------------------

  it("should auto-fetch on mount by default", async () => {
    const service = makeMockService(50, 0);

    await act(async () => {
      renderHook(() => usePagination<Item>(service));
    });

    expect(service).toHaveBeenCalledTimes(1);
    expect(service).toHaveBeenCalledWith({ current: 1, pageSize: 10 });
  });

  it("should not auto-fetch when manual is true", () => {
    const service = makeMockService(50, 0);
    renderHook(() => usePagination<Item>(service, { manual: true }));
    expect(service).not.toHaveBeenCalled();
  });

  it("should populate data and total after successful auto-fetch", async () => {
    const service = makeMockService(50, 0);
    const { result } = renderHook(() =>
      usePagination<Item>(service, { defaultPageSize: 10 })
    );

    await act(async () => {
      await Promise.resolve();
    });

    const [{ data, total, totalPage, loading, error }] = result.current;
    expect(loading).toBe(false);
    expect(error).toBe(null);
    expect(total).toBe(50);
    expect(totalPage).toBe(5);
    expect(data).toHaveLength(10);
    expect(data[0]).toEqual({ id: 1, label: "item-1" });
  });

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------

  it("should set loading to true while a fetch is in progress", async () => {
    let resolveService!: (v: { total: number; list: Item[] }) => void;
    const pendingService = vi.fn(
      () =>
        new Promise<{ total: number; list: Item[] }>((resolve) => {
          resolveService = resolve;
        })
    );

    const { result } = renderHook(() =>
      usePagination<Item>(pendingService, { manual: true })
    );

    // Start a fetch manually
    act(() => {
      result.current[1].run();
    });

    expect(result.current[0].loading).toBe(true);

    // Resolve and assert loading clears
    await act(async () => {
      resolveService({ total: 1, list: [{ id: 1, label: "item-1" }] });
      await Promise.resolve();
    });

    expect(result.current[0].loading).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Error handling
  // -------------------------------------------------------------------------

  it("should set error when the service rejects", async () => {
    const boom = new Error("service error");
    const failingService = vi.fn(() => Promise.reject(boom));

    const { result } = renderHook(() =>
      usePagination<Item>(failingService as unknown as PaginationService<Item>)
    );

    await act(async () => {
      await Promise.resolve();
    });

    const [{ error, loading, data }] = result.current;
    expect(error).toBe(boom);
    expect(loading).toBe(false);
    expect(data).toEqual([]);
  });

  it("should wrap non-Error rejections in an Error", async () => {
    const failingService = vi.fn(() => Promise.reject("string error"));

    const { result } = renderHook(() =>
      usePagination<Item>(failingService as unknown as PaginationService<Item>)
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current[0].error).toBeInstanceOf(Error);
    expect(result.current[0].error?.message).toBe("string error");
  });

  it("should clear a previous error on a subsequent successful fetch", async () => {
    const boom = new Error("first error");
    let callCount = 0;
    const flakyService = vi.fn(() => {
      callCount++;
      if (callCount === 1) return Promise.reject(boom);
      return Promise.resolve({ total: 1, list: [{ id: 1, label: "item-1" }] });
    });

    const { result } = renderHook(() =>
      usePagination<Item>(
        flakyService as unknown as PaginationService<Item>,
        { manual: true }
      )
    );

    // First run — fails
    await act(async () => {
      result.current[1].run();
      await Promise.resolve();
    });
    expect(result.current[0].error).toBe(boom);

    // Second run — succeeds
    await act(async () => {
      result.current[1].run();
      await Promise.resolve();
    });
    expect(result.current[0].error).toBe(null);
    expect(result.current[0].data).toHaveLength(1);
  });

  // -------------------------------------------------------------------------
  // changeCurrent
  // -------------------------------------------------------------------------

  it("should update current and re-fetch when changeCurrent is called", async () => {
    const service = makeMockService(50, 0);
    const { result } = renderHook(() =>
      usePagination<Item>(service, { defaultPageSize: 10 })
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      result.current[1].changeCurrent(3);
      await Promise.resolve();
    });

    expect(result.current[0].current).toBe(3);
    expect(result.current[0].pageSize).toBe(10);
    expect(service).toHaveBeenLastCalledWith({ current: 3, pageSize: 10 });
  });

  // -------------------------------------------------------------------------
  // changePageSize
  // -------------------------------------------------------------------------

  it("should reset to page 1 and re-fetch when changePageSize is called", async () => {
    const service = makeMockService(50, 0);
    const { result } = renderHook(() =>
      usePagination<Item>(service, { defaultCurrent: 3, defaultPageSize: 10 })
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      result.current[1].changePageSize(25);
      await Promise.resolve();
    });

    expect(result.current[0].current).toBe(1);
    expect(result.current[0].pageSize).toBe(25);
    expect(service).toHaveBeenLastCalledWith({ current: 1, pageSize: 25 });
  });

  // -------------------------------------------------------------------------
  // onChange
  // -------------------------------------------------------------------------

  it("should update both current and pageSize with onChange", async () => {
    const service = makeMockService(100, 0);
    const { result } = renderHook(() =>
      usePagination<Item>(service, { manual: true })
    );

    await act(async () => {
      result.current[1].onChange(4, 20);
      await Promise.resolve();
    });

    expect(result.current[0].current).toBe(4);
    expect(result.current[0].pageSize).toBe(20);
    expect(service).toHaveBeenCalledWith({ current: 4, pageSize: 20 });
  });

  // -------------------------------------------------------------------------
  // reload
  // -------------------------------------------------------------------------

  it("should re-fetch with unchanged params when reload is called", async () => {
    const service = makeMockService(50, 0);
    const { result } = renderHook(() =>
      usePagination<Item>(service, { defaultCurrent: 2, defaultPageSize: 10 })
    );

    await act(async () => {
      await Promise.resolve();
    });

    const callsBefore = (service as ReturnType<typeof vi.fn>).mock.calls.length;

    await act(async () => {
      result.current[1].reload();
      await Promise.resolve();
    });

    expect(service).toHaveBeenCalledTimes(callsBefore + 1);
    expect(service).toHaveBeenLastCalledWith({ current: 2, pageSize: 10 });
  });

  // -------------------------------------------------------------------------
  // run
  // -------------------------------------------------------------------------

  it("should trigger a fetch with current params when run() is called without args", async () => {
    const service = makeMockService(50, 0);
    const { result } = renderHook(() =>
      usePagination<Item>(service, {
        manual: true,
        defaultCurrent: 2,
        defaultPageSize: 15,
      })
    );

    await act(async () => {
      result.current[1].run();
      await Promise.resolve();
    });

    expect(service).toHaveBeenCalledWith({ current: 2, pageSize: 15 });
  });

  it("should override params when run({ current, pageSize }) is called", async () => {
    const service = makeMockService(100, 0);
    const { result } = renderHook(() =>
      usePagination<Item>(service, { manual: true })
    );

    await act(async () => {
      result.current[1].run({ current: 5, pageSize: 20 });
      await Promise.resolve();
    });

    expect(result.current[0].current).toBe(5);
    expect(result.current[0].pageSize).toBe(20);
    expect(service).toHaveBeenCalledWith({ current: 5, pageSize: 20 });
  });

  // -------------------------------------------------------------------------
  // cancel
  // -------------------------------------------------------------------------

  it("should discard an in-flight request when cancel is called", async () => {
    let resolveService!: (v: { total: number; list: Item[] }) => void;
    const pendingService = vi.fn(
      () =>
        new Promise<{ total: number; list: Item[] }>((resolve) => {
          resolveService = resolve;
        })
    );

    const { result } = renderHook(() =>
      usePagination<Item>(pendingService, { manual: true })
    );

    act(() => {
      result.current[1].run();
    });

    expect(result.current[0].loading).toBe(true);

    act(() => {
      result.current[1].cancel();
    });

    expect(result.current[0].loading).toBe(false);

    // Resolve the discarded request — state must not change
    await act(async () => {
      resolveService({ total: 99, list: makeItems(10) });
      await Promise.resolve();
    });

    expect(result.current[0].total).toBe(0);
    expect(result.current[0].data).toEqual([]);
  });

  // -------------------------------------------------------------------------
  // totalPage calculation
  // -------------------------------------------------------------------------

  it("should compute totalPage correctly", async () => {
    const service = makeMockService(55, 0);
    const { result } = renderHook(() =>
      usePagination<Item>(service, { defaultPageSize: 10 })
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current[0].totalPage).toBe(6); // ceil(55/10)
  });

  it("should return totalPage 0 when total is 0", async () => {
    const service = makeMockService(0, 0);
    const { result } = renderHook(() => usePagination<Item>(service));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current[0].totalPage).toBe(0);
  });

  // -------------------------------------------------------------------------
  // Stale-request isolation
  // -------------------------------------------------------------------------

  it("should ignore stale responses when a newer fetch supersedes them", async () => {
    let resolveFirst!: (v: { total: number; list: Item[] }) => void;
    let resolveSecond!: (v: { total: number; list: Item[] }) => void;
    let callCount = 0;

    const racingService = vi.fn(() => {
      callCount++;
      if (callCount === 1) {
        return new Promise<{ total: number; list: Item[] }>((resolve) => {
          resolveFirst = resolve;
        });
      }
      return new Promise<{ total: number; list: Item[] }>((resolve) => {
        resolveSecond = resolve;
      });
    });

    const { result } = renderHook(() =>
      usePagination<Item>(racingService as unknown as PaginationService<Item>, {
        manual: true,
      })
    );

    // Fire two requests back-to-back
    act(() => {
      result.current[1].run({ current: 1 });
    });
    act(() => {
      result.current[1].run({ current: 2 });
    });

    // Resolve the first (stale) request
    await act(async () => {
      resolveFirst({ total: 100, list: makeItems(10) });
      await Promise.resolve();
    });

    // State should still be loading (second request in flight)
    expect(result.current[0].loading).toBe(true);
    expect(result.current[0].total).toBe(0); // stale result ignored

    // Resolve the second (current) request
    await act(async () => {
      resolveSecond({ total: 200, list: makeItems(10, 10) });
      await Promise.resolve();
    });

    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].total).toBe(200);
    expect(result.current[0].current).toBe(2);
  });

  // -------------------------------------------------------------------------
  // Post-unmount safety
  // -------------------------------------------------------------------------

  it("should not update state after the component is unmounted", async () => {
    let resolveService!: (v: { total: number; list: Item[] }) => void;
    const pendingService = vi.fn(
      () =>
        new Promise<{ total: number; list: Item[] }>((resolve) => {
          resolveService = resolve;
        })
    );

    const { result, unmount } = renderHook(() =>
      usePagination<Item>(pendingService, { manual: true })
    );

    act(() => {
      result.current[1].run();
    });

    unmount();

    // Resolve after unmount — should not throw and state should not update
    await act(async () => {
      resolveService({ total: 42, list: makeItems(5) });
      await Promise.resolve();
    });

    // No crash and no state mutation (values stay at their defaults)
    expect(result.current[0].total).toBe(0);
    expect(result.current[0].data).toEqual([]);
  });

  // -------------------------------------------------------------------------
  // Callback stability
  // -------------------------------------------------------------------------

  it("should keep control callbacks stable across re-renders", () => {
    const service = makeMockService(0);
    const { result, rerender } = renderHook(() =>
      usePagination<Item>(service, { manual: true })
    );

    const controlsBefore = result.current[1];
    rerender();
    const controlsAfter = result.current[1];

    expect(controlsAfter.onChange).toBe(controlsBefore.onChange);
    expect(controlsAfter.changeCurrent).toBe(controlsBefore.changeCurrent);
    expect(controlsAfter.changePageSize).toBe(controlsBefore.changePageSize);
    expect(controlsAfter.reload).toBe(controlsBefore.reload);
    expect(controlsAfter.run).toBe(controlsBefore.run);
    expect(controlsAfter.cancel).toBe(controlsBefore.cancel);
  });
});
