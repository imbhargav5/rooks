import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type DependencyList,
  type RefObject,
} from "react";
import { noop } from "@/utils/noop";

/**
 * Data shape required by useInfiniteScroll.
 * TData must contain a `list` array to indicate paginated results.
 */
type InfiniteScrollData = {
  list: unknown[];
};

/**
 * Options for the useInfiniteScroll hook.
 */
interface UseInfiniteScrollOptions<TData extends InfiniteScrollData> {
  /**
   * A DOM element or React ref to observe with IntersectionObserver.
   * When this element enters the viewport, `loadMore` is triggered automatically.
   */
  target?: RefObject<Element | null> | Element | null;
  /**
   * Returns `true` when there are no more items to load.
   * Prevents further auto-loading and sets `noMore` to `true`.
   */
  isNoMore?: (data?: TData) => boolean;
  /**
   * IntersectionObserver threshold (0–1). Defaults to `0.1`.
   */
  threshold?: number;
  /**
   * When `true`, the hook does not fetch automatically on mount.
   * Call `reload()` or `loadMore()` manually. Defaults to `false`.
   */
  manual?: boolean;
  /**
   * Reload all data from scratch when any of these dependencies change.
   */
  reloadDeps?: DependencyList;
  /** Called before each service invocation. */
  onBefore?: () => void;
  /** Called when the service resolves successfully. */
  onSuccess?: (data: TData) => void;
  /** Called when the service rejects. */
  onError?: (error: Error) => void;
  /** Called after the service call, regardless of outcome. */
  onFinally?: () => void;
}

/**
 * Controls returned as the second element of the useInfiniteScroll tuple.
 */
interface UseInfiniteScrollControls<TData extends InfiniteScrollData> {
  /** `true` during the initial or reload fetch. */
  loading: boolean;
  /** `true` while an incremental "load more" fetch is in progress. */
  loadingMore: boolean;
  /** `true` when `isNoMore` returns `true` for the current data. */
  noMore: boolean;
  /** Fire-and-forget wrapper around `loadMoreAsync`. */
  loadMore: () => void;
  /** Append the next page and return the updated data. */
  loadMoreAsync: () => Promise<TData | undefined>;
  /** Clear data and re-fetch from scratch. */
  reload: () => Promise<void>;
  /** Abandon the current in-flight service call. */
  cancel: () => void;
  /** Directly replace the accumulated data. */
  mutate: (data?: TData) => void;
}

/**
 * useInfiniteScroll
 *
 * Manages infinite-scroll data loading. Calls `service` on mount (unless
 * `manual` is `true`) and again whenever `loadMore` / `reload` are invoked.
 * Optionally observes a DOM element via IntersectionObserver and triggers
 * `loadMore` automatically when it enters the viewport.
 *
 * The `service` function receives the current accumulated data (or `undefined`
 * on the first / reload call) and must return the next snapshot, typically
 * by appending new items to `data.list`.
 *
 * @param service - Async function that loads data, receiving the previous
 *   accumulation so it can determine the next page.
 * @param options - Configuration options (target, isNoMore, threshold, …).
 * @returns A tuple `[data, controls]`.
 *
 * @example
 * ```tsx
 * interface UserPage {
 *   list: User[];
 *   total: number;
 * }
 *
 * function UserList() {
 *   const sentinelRef = useRef<HTMLDivElement>(null);
 *
 *   const [data, { loading, loadingMore, noMore, reload }] = useInfiniteScroll<UserPage>(
 *     async (prev) => {
 *       const page = Math.floor((prev?.list.length ?? 0) / 10) + 1;
 *       const res = await fetchUsers({ page, pageSize: 10 });
 *       return { list: [...(prev?.list ?? []), ...res.list], total: res.total };
 *     },
 *     {
 *       target: sentinelRef,
 *       isNoMore: (d) => (d?.list.length ?? 0) >= (d?.total ?? 0),
 *     }
 *   );
 *
 *   if (loading) return <p>Loading…</p>;
 *   return (
 *     <>
 *       {data?.list.map((u) => <div key={u.id}>{u.name}</div>)}
 *       <div ref={sentinelRef}>{loadingMore ? "Loading more…" : noMore ? "No more" : null}</div>
 *       <button onClick={reload}>Reload</button>
 *     </>
 *   );
 * }
 * ```
 */
function useInfiniteScroll<TData extends InfiniteScrollData>(
  service: (data?: TData) => Promise<TData>,
  options: UseInfiniteScrollOptions<TData> = {}
): [TData | undefined, UseInfiniteScrollControls<TData>] {
  const {
    target = null,
    isNoMore,
    threshold = 0.1,
    manual = false,
    reloadDeps = [],
    onBefore,
    onSuccess,
    onError,
    onFinally,
  } = options;

  const [data, setData] = useState<TData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(!manual);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Refs that mirror mutable state — allow stable callbacks to read current
  // values without adding them to dependency arrays and causing re-creation.
  const dataRef = useRef<TData | undefined>(undefined);
  const loadingRef = useRef<boolean>(!manual);
  const loadingMoreRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  // Increment this to cancel any in-flight call: a completed call whose
  // generation no longer matches requestIdRef.current is silently discarded.
  const requestIdRef = useRef<number>(0);

  // Keep user-supplied callbacks in refs so that reload / loadMoreAsync
  // can remain stable (useCallback([]) deps) even when the caller recreates them.
  const serviceRef = useRef(service);
  useEffect(() => {
    serviceRef.current = service;
  });
  const onBeforeRef = useRef(onBefore);
  useEffect(() => {
    onBeforeRef.current = onBefore;
  });
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  });
  const onFinallyRef = useRef(onFinally);
  useEffect(() => {
    onFinallyRef.current = onFinally;
  });

  // ------------------------------------------------------------------
  // Helpers that sync both the ref and the React state together
  // ------------------------------------------------------------------

  const syncData = useCallback((next: TData | undefined) => {
    dataRef.current = next;
    setData(next);
  }, []);

  const syncLoading = useCallback((next: boolean) => {
    loadingRef.current = next;
    setLoading(next);
  }, []);

  const syncLoadingMore = useCallback((next: boolean) => {
    loadingMoreRef.current = next;
    setLoadingMore(next);
  }, []);

  // ------------------------------------------------------------------
  // cancel — abandons the current in-flight call
  // ------------------------------------------------------------------

  const cancel = useCallback(() => {
    requestIdRef.current++;
    syncLoading(false);
    syncLoadingMore(false);
  }, [syncLoading, syncLoadingMore]);

  // ------------------------------------------------------------------
  // mutate — directly replace the accumulated data
  // ------------------------------------------------------------------

  const mutate = useCallback(
    (next?: TData) => {
      syncData(next);
    },
    [syncData]
  );

  // ------------------------------------------------------------------
  // loadMoreAsync — append the next page; returns updated data
  // ------------------------------------------------------------------

  const loadMoreAsync = useCallback(async (): Promise<TData | undefined> => {
    if (loadingRef.current || loadingMoreRef.current) return undefined;

    const id = ++requestIdRef.current;
    syncLoadingMore(true);
    onBeforeRef.current?.();

    try {
      const result = await serviceRef.current(dataRef.current);

      if (!mountedRef.current || id !== requestIdRef.current) return undefined;

      syncData(result);
      onSuccessRef.current?.(result);
      return result;
    } catch (err) {
      if (!mountedRef.current || id !== requestIdRef.current) return undefined;

      const error = err instanceof Error ? err : new Error(String(err));
      onErrorRef.current?.(error);
      return undefined;
    } finally {
      if (mountedRef.current && id === requestIdRef.current) {
        syncLoadingMore(false);
        onFinallyRef.current?.();
      }
    }
  }, [syncData, syncLoadingMore]);

  // ------------------------------------------------------------------
  // loadMore — fire-and-forget wrapper
  // ------------------------------------------------------------------

  const loadMore = useCallback(() => {
    void loadMoreAsync();
  }, [loadMoreAsync]);

  // ------------------------------------------------------------------
  // reload — reset data and re-fetch from page 1
  // ------------------------------------------------------------------

  const reload = useCallback(async (): Promise<void> => {
    const id = ++requestIdRef.current;
    syncData(undefined);
    syncLoading(true);
    onBeforeRef.current?.();

    try {
      const result = await serviceRef.current(undefined);

      if (!mountedRef.current || id !== requestIdRef.current) return;

      syncData(result);
      onSuccessRef.current?.(result);
    } catch (err) {
      if (!mountedRef.current || id !== requestIdRef.current) return;

      const error = err instanceof Error ? err : new Error(String(err));
      onErrorRef.current?.(error);
    } finally {
      if (mountedRef.current && id === requestIdRef.current) {
        syncLoading(false);
        onFinallyRef.current?.();
      }
    }
  }, [syncData, syncLoading]);

  // ------------------------------------------------------------------
  // Initial load on mount
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!manual) {
      void reload();
    }
    // Intentionally empty deps: only run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // Reload when reloadDeps change (skip mount — handled above)
  // ------------------------------------------------------------------

  const reloadDepsInitialized = useRef(false);
  useEffect(() => {
    if (!reloadDepsInitialized.current) {
      reloadDepsInitialized.current = true;
      return;
    }
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, reloadDeps);

  // ------------------------------------------------------------------
  // IntersectionObserver — auto-trigger loadMore when target is visible
  // ------------------------------------------------------------------

  useEffect(() => {
    if (typeof window === "undefined") return noop;

    // Resolve the element inside the effect (after the commit phase) so that
    // RefObjects are already populated with their DOM node before we read them.
    const element =
      target == null
        ? null
        : target instanceof Element
        ? target
        : (target as RefObject<Element | null>).current;

    if (!element) return noop;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry?.isIntersecting &&
          !loadingRef.current &&
          !loadingMoreRef.current
        ) {
          void loadMoreAsync();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [target, threshold, loadMoreAsync]);

  // ------------------------------------------------------------------
  // Cleanup on unmount
  // ------------------------------------------------------------------

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ------------------------------------------------------------------
  // noMore — derived from latest data on every render
  // ------------------------------------------------------------------

  const noMore = isNoMore ? isNoMore(data) : false;

  return [
    data,
    {
      loading,
      loadingMore,
      noMore,
      loadMore,
      loadMoreAsync,
      reload,
      cancel,
      mutate,
    },
  ];
}

export { useInfiniteScroll };
export type {
  UseInfiniteScrollOptions,
  UseInfiniteScrollControls,
  InfiniteScrollData,
};
