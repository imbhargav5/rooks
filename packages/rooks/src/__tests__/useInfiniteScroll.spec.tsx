import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React, { useRef } from "react";
import { render, screen } from "@testing-library/react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

// ---------------------------------------------------------------------------
// IntersectionObserver mock
// ---------------------------------------------------------------------------

const mockObserver = {
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
};
const mockObserverCtor = vi.fn();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface Page {
  list: string[];
  total: number;
}

const makeService =
  (
    items: string[],
    pageSize = 3,
    delay = 0
  ): ((prev?: Page) => Promise<Page>) =>
  async (prev) => {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    const loaded = prev?.list ?? [];
    const next = items.slice(loaded.length, loaded.length + pageSize);
    return { list: [...loaded, ...next], total: items.length };
  };

const ALL_ITEMS = ["a", "b", "c", "d", "e", "f", "g"];

// ---------------------------------------------------------------------------

describe("useInfiniteScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Must use a regular function (not arrow) to be usable as a `new` constructor.
    mockObserverCtor.mockImplementation(function () {
      return mockObserver;
    });
    global.IntersectionObserver = mockObserverCtor as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Basic
  // -------------------------------------------------------------------------

  describe("Basic", () => {
    it("is defined", () => {
      expect(useInfiniteScroll).toBeDefined();
    });

    it("returns a tuple [data, controls]", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useInfiniteScroll(makeService(ALL_ITEMS), { manual: true })
      );
      const [data, controls] = result.current;
      expect(data).toBeUndefined();
      expect(controls).toMatchObject({
        loading: expect.any(Boolean),
        loadingMore: expect.any(Boolean),
        noMore: expect.any(Boolean),
        loadMore: expect.any(Function),
        loadMoreAsync: expect.any(Function),
        reload: expect.any(Function),
        cancel: expect.any(Function),
        mutate: expect.any(Function),
      });
    });

    it("loads initial data on mount when manual is false", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS));
      const { result } = renderHook(() => useInfiniteScroll(service));

      // loading starts true
      expect(result.current[1].loading).toBe(true);

      await waitFor(() => {
        expect(result.current[1].loading).toBe(false);
      });

      expect(service).toHaveBeenCalledTimes(1);
      expect(service).toHaveBeenCalledWith(undefined);
      expect(result.current[0]?.list).toEqual(["a", "b", "c"]);
    });

    it("does not load on mount when manual is true", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS));
      const { result } = renderHook(() =>
        useInfiniteScroll(service, { manual: true })
      );

      // Give effects time to fire
      await act(async () => {
        await new Promise((r) => setTimeout(r, 20));
      });

      expect(service).not.toHaveBeenCalled();
      expect(result.current[1].loading).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // loadMore / loadMoreAsync
  // -------------------------------------------------------------------------

  describe("loadMore / loadMoreAsync", () => {
    it("appends the next page via loadMoreAsync", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS));
      const { result } = renderHook(() => useInfiniteScroll(service));

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(result.current[0]?.list).toEqual(["a", "b", "c"]);

      await act(async () => {
        await result.current[1].loadMoreAsync();
      });

      expect(result.current[0]?.list).toEqual(["a", "b", "c", "d", "e", "f"]);
      expect(service).toHaveBeenCalledTimes(2);
    });

    it("sets loadingMore to true while fetching, false after", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS, 3, 50));
      const { result } = renderHook(() => useInfiniteScroll(service));

      await waitFor(() => expect(result.current[1].loading).toBe(false));

      let loadingMoreDuringFetch = false;
      act(() => {
        result.current[1].loadMore();
        loadingMoreDuringFetch = result.current[1].loadingMore;
      });

      // Because loadingMore state update is async, wait until it turns true
      await waitFor(() => expect(result.current[1].loadingMore).toBe(true));

      await waitFor(() => expect(result.current[1].loadingMore).toBe(false));
    });

    it("ignores concurrent loadMore calls while already loading", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS, 3, 30));
      const { result } = renderHook(() => useInfiniteScroll(service));

      await waitFor(() => expect(result.current[1].loading).toBe(false));

      // Fire two loadMore calls simultaneously
      act(() => {
        result.current[1].loadMore();
        result.current[1].loadMore(); // should be ignored
      });

      await waitFor(() => expect(result.current[1].loadingMore).toBe(false));

      // Service should only have been called once for "load more"
      expect(service).toHaveBeenCalledTimes(2); // 1 initial + 1 loadMore
    });
  });

  // -------------------------------------------------------------------------
  // reload
  // -------------------------------------------------------------------------

  describe("reload", () => {
    it("clears data and re-fetches from scratch", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS));
      const { result } = renderHook(() => useInfiniteScroll(service));

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      await act(async () => { await result.current[1].loadMoreAsync(); });
      expect(result.current[0]?.list).toHaveLength(6);

      await act(async () => { await result.current[1].reload(); });

      // After reload, back to first page
      expect(result.current[0]?.list).toHaveLength(3);
      expect(service).toHaveBeenCalledTimes(3); // initial + loadMore + reload
    });

    it("calls service with undefined on reload", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS));
      const { result } = renderHook(() => useInfiniteScroll(service));

      await waitFor(() => expect(result.current[1].loading).toBe(false));

      await act(async () => { await result.current[1].reload(); });

      const calls = service.mock.calls;
      // Both initial call and reload call should pass undefined
      expect(calls[0][0]).toBeUndefined();
      expect(calls[1][0]).toBeUndefined();
    });

    it("sets loading true during reload, false after", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useInfiniteScroll(makeService(ALL_ITEMS, 3, 30))
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));

      act(() => { void result.current[1].reload(); });
      await waitFor(() => expect(result.current[1].loading).toBe(true));
      await waitFor(() => expect(result.current[1].loading).toBe(false));
    });
  });

  // -------------------------------------------------------------------------
  // noMore
  // -------------------------------------------------------------------------

  describe("noMore", () => {
    it("is false when isNoMore is not provided", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInfiniteScroll(makeService(ALL_ITEMS)));

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(result.current[1].noMore).toBe(false);
    });

    it("becomes true when isNoMore returns true", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useInfiniteScroll(makeService(ALL_ITEMS), {
          isNoMore: (d) => (d?.list.length ?? 0) >= ALL_ITEMS.length,
        })
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(result.current[1].noMore).toBe(false);

      // Load remaining pages
      await act(async () => { await result.current[1].loadMoreAsync(); });
      await act(async () => { await result.current[1].loadMoreAsync(); });

      expect(result.current[0]?.list).toHaveLength(ALL_ITEMS.length);
      expect(result.current[1].noMore).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // cancel
  // -------------------------------------------------------------------------

  describe("cancel", () => {
    it("stops the loading state immediately", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS, 3, 100));
      const { result } = renderHook(() => useInfiniteScroll(service));

      // Should start loading
      await waitFor(() => expect(result.current[1].loading).toBe(true));

      act(() => { result.current[1].cancel(); });

      expect(result.current[1].loading).toBe(false);
      expect(result.current[1].loadingMore).toBe(false);
    });

    it("discards result of cancelled call", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS, 3, 50));
      const { result } = renderHook(() => useInfiniteScroll(service));

      await waitFor(() => expect(result.current[1].loading).toBe(true));

      // Cancel mid-flight
      act(() => { result.current[1].cancel(); });

      // Data should remain undefined (initial load was cancelled)
      await act(async () => {
        await new Promise((r) => setTimeout(r, 100));
      });
      expect(result.current[0]).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // mutate
  // -------------------------------------------------------------------------

  describe("mutate", () => {
    it("directly replaces current data", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInfiniteScroll<Page>(makeService(ALL_ITEMS)));

      await waitFor(() => expect(result.current[1].loading).toBe(false));

      act(() => {
        result.current[1].mutate({ list: ["x", "y"], total: 2 });
      });

      expect(result.current[0]?.list).toEqual(["x", "y"]);
    });

    it("can reset data to undefined", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInfiniteScroll<Page>(makeService(ALL_ITEMS)));

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(result.current[0]).toBeDefined();

      act(() => { result.current[1].mutate(undefined); });
      expect(result.current[0]).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Callbacks
  // -------------------------------------------------------------------------

  describe("Callbacks", () => {
    it("calls onBefore before service", async () => {
      expect.hasAssertions();
      const onBefore = vi.fn();
      const service = vi.fn(makeService(ALL_ITEMS));
      const { result } = renderHook(() =>
        useInfiniteScroll(service, { onBefore })
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(onBefore).toHaveBeenCalledTimes(1);
    });

    it("calls onSuccess with resolved data", async () => {
      expect.hasAssertions();
      const onSuccess = vi.fn();
      const { result } = renderHook(() =>
        useInfiniteScroll(makeService(ALL_ITEMS), { onSuccess })
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(onSuccess).toHaveBeenCalledOnce();
      expect(onSuccess.mock.calls[0][0].list).toEqual(["a", "b", "c"]);
    });

    it("calls onError when service rejects", async () => {
      expect.hasAssertions();
      const onError = vi.fn();
      const failingService = vi.fn(async () => {
        throw new Error("boom");
      });
      const { result } = renderHook(() =>
        useInfiniteScroll(failingService, { onError })
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(onError).toHaveBeenCalledOnce();
      expect(onError.mock.calls[0][0].message).toBe("boom");
    });

    it("calls onFinally after success", async () => {
      expect.hasAssertions();
      const onFinally = vi.fn();
      const { result } = renderHook(() =>
        useInfiniteScroll(makeService(ALL_ITEMS), { onFinally })
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(onFinally).toHaveBeenCalledTimes(1);
    });

    it("calls onFinally after error", async () => {
      expect.hasAssertions();
      const onFinally = vi.fn();
      const { result } = renderHook(() =>
        useInfiniteScroll(async () => { throw new Error("err"); }, { onFinally })
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(onFinally).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // reloadDeps
  // -------------------------------------------------------------------------

  describe("reloadDeps", () => {
    it("reloads when a dependency changes", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS));
      const { result, rerender } = renderHook(
        ({ dep }: { dep: number }) =>
          useInfiniteScroll(service, { reloadDeps: [dep] }),
        { initialProps: { dep: 0 } }
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(service).toHaveBeenCalledTimes(1);

      rerender({ dep: 1 });

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(service).toHaveBeenCalledTimes(2);
    });

    it("does not reload on re-render without dep change", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS));
      const { result, rerender } = renderHook(
        ({ dep }: { dep: number }) =>
          useInfiniteScroll(service, { reloadDeps: [dep] }),
        { initialProps: { dep: 0 } }
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      rerender({ dep: 0 });
      await act(async () => {
        await new Promise((r) => setTimeout(r, 20));
      });
      // Still only called once
      expect(service).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // IntersectionObserver target
  // -------------------------------------------------------------------------

  describe("IntersectionObserver target", () => {
    it("creates an observer when a target element is provided", async () => {
      expect.hasAssertions();
      const element = document.createElement("div");
      const { result } = renderHook(() =>
        useInfiniteScroll(makeService(ALL_ITEMS), { target: element })
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));

      expect(mockObserverCtor).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: 0.1 })
      );
      expect(mockObserver.observe).toHaveBeenCalledWith(element);
    });

    it("disconnects observer on unmount", async () => {
      expect.hasAssertions();
      const element = document.createElement("div");
      const { result, unmount } = renderHook(() =>
        useInfiniteScroll(makeService(ALL_ITEMS), { target: element })
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));
      unmount();

      expect(mockObserver.disconnect).toHaveBeenCalled();
    });

    it("uses custom threshold", async () => {
      expect.hasAssertions();
      const element = document.createElement("div");
      renderHook(() =>
        useInfiniteScroll(makeService(ALL_ITEMS), { target: element, threshold: 0.5 })
      );

      await waitFor(() => expect(mockObserverCtor).toHaveBeenCalled());

      expect(mockObserverCtor).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: 0.5 })
      );
    });

    it("triggers loadMore when target intersects", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS));
      const element = document.createElement("div");
      const { result } = renderHook(() =>
        useInfiniteScroll(service, { target: element })
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));

      const observerCallback = mockObserverCtor.mock.calls[0][0] as IntersectionObserverCallback;

      await act(async () => {
        observerCallback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          mockObserver as unknown as IntersectionObserver
        );
      });

      await waitFor(() => expect(result.current[1].loadingMore).toBe(false));

      // Initial load + 1 auto-triggered load more
      expect(service).toHaveBeenCalledTimes(2);
    });

    it("does not trigger loadMore when isIntersecting is false", async () => {
      expect.hasAssertions();
      const service = vi.fn(makeService(ALL_ITEMS));
      const element = document.createElement("div");
      const { result } = renderHook(() =>
        useInfiniteScroll(service, { target: element })
      );

      await waitFor(() => expect(result.current[1].loading).toBe(false));

      const observerCallback = mockObserverCtor.mock.calls[0][0] as IntersectionObserverCallback;

      act(() => {
        observerCallback(
          [{ isIntersecting: false } as IntersectionObserverEntry],
          mockObserver as unknown as IntersectionObserver
        );
      });

      await act(async () => {
        await new Promise((r) => setTimeout(r, 20));
      });

      // Still only the initial load
      expect(service).toHaveBeenCalledTimes(1);
    });

    it("accepts a React RefObject as target", async () => {
      expect.hasAssertions();

      const TestComponent = () => {
        const ref = useRef<HTMLDivElement>(null);
        const [, controls] = useInfiniteScroll(makeService(ALL_ITEMS), {
          target: ref,
        });
        return (
          <div>
            <div ref={ref} data-testid="sentinel" />
            <div data-testid="loading">{String(controls.loading)}</div>
          </div>
        );
      };

      render(<TestComponent />);
      await waitFor(() =>
        expect(screen.getByTestId("loading")).toHaveTextContent("false")
      );

      // Observer should have been created and set up for the div element
      expect(mockObserverCtor).toHaveBeenCalled();
      expect(mockObserver.observe).toHaveBeenCalledWith(
        screen.getByTestId("sentinel")
      );
    });
  });

  // -------------------------------------------------------------------------
  // SSR / no-target path
  // -------------------------------------------------------------------------

  describe("SSR safety", () => {
    it("does not throw when target is null", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useInfiniteScroll(makeService(ALL_ITEMS), { target: null })
      );
      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(mockObserverCtor).not.toHaveBeenCalled();
    });

    it("does not throw when target is undefined", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useInfiniteScroll(makeService(ALL_ITEMS))
      );
      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(mockObserverCtor).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Integration
  // -------------------------------------------------------------------------

  describe("Integration", () => {
    it("full lifecycle: load → loadMore → noMore → reload", async () => {
      expect.hasAssertions();
      const items = ["a", "b", "c", "d"];
      const service = vi.fn(makeService(items, 2));
      const { result } = renderHook(() =>
        useInfiniteScroll(service, {
          isNoMore: (d) => (d?.list.length ?? 0) >= items.length,
        })
      );

      // Phase 1: initial load
      await waitFor(() => expect(result.current[1].loading).toBe(false));
      expect(result.current[0]?.list).toEqual(["a", "b"]);
      expect(result.current[1].noMore).toBe(false);

      // Phase 2: loadMore
      await act(async () => { await result.current[1].loadMoreAsync(); });
      expect(result.current[0]?.list).toEqual(["a", "b", "c", "d"]);
      expect(result.current[1].noMore).toBe(true);

      // Phase 3: reload resets noMore
      await act(async () => { await result.current[1].reload(); });
      expect(result.current[0]?.list).toEqual(["a", "b"]);
      expect(result.current[1].noMore).toBe(false);
    });
  });
});
