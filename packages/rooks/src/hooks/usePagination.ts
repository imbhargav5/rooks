import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Service function that receives pagination params and returns a page of data.
 */
type PaginationService<TData> = (params: {
  current: number;
  pageSize: number;
}) => Promise<{ total: number; list: TData[] }>;

/**
 * Options for configuring usePagination.
 */
type UsePaginationOptions = {
  /** Number of records per page. @default 10 */
  defaultPageSize?: number;
  /** Initial page number. @default 1 */
  defaultCurrent?: number;
  /**
   * When `true` the service is not called automatically on mount.
   * Call `run()` to trigger the first fetch.
   * @default false
   */
  manual?: boolean;
};

/**
 * Pagination state returned as the first element of the tuple.
 */
type PaginationData<TData> = {
  /** Records on the current page */
  data: TData[];
  /** Total number of records across all pages */
  total: number;
  /** Current page number (1-based) */
  current: number;
  /** Number of records per page */
  pageSize: number;
  /** Total number of pages (`Math.ceil(total / pageSize)`) */
  totalPage: number;
  /** `true` while a fetch is in progress */
  loading: boolean;
  /** Error thrown by the service, or `null` */
  error: Error | null;
};

/**
 * Control methods returned as the second element of the tuple.
 */
type PaginationControls = {
  /** Change both current page and page size, then re-fetch */
  onChange: (current: number, pageSize: number) => void;
  /** Navigate to a specific page and re-fetch */
  changeCurrent: (current: number) => void;
  /** Change page size, reset to page 1, then re-fetch */
  changePageSize: (pageSize: number) => void;
  /** Re-fetch the current page with unchanged params */
  reload: () => void;
  /** Manually trigger a fetch, optionally overriding current / pageSize */
  run: (params?: { current?: number; pageSize?: number }) => void;
  /** Discard the current in-flight request and clear the loading state */
  cancel: () => void;
};

/**
 * Return type of usePagination — a two-element tuple.
 */
type UsePaginationReturn<TData> = [PaginationData<TData>, PaginationControls];

/**
 * usePagination
 *
 * Pagination state tied to an async data source. Fetches the first page
 * automatically on mount (unless `manual` is set). Handles loading state,
 * error state, and stale-request cancellation via a generation counter so
 * that out-of-order responses never corrupt state.
 *
 * SSR-safe: no `window` / `document` access; the auto-fetch is deferred to
 * `useEffect` which does not run on the server.
 *
 * @param service - Async function called with `{ current, pageSize }` that
 *   must resolve to `{ total: number; list: TData[] }`.
 * @param options - Optional configuration (`defaultPageSize`, `defaultCurrent`,
 *   `manual`).
 * @returns Tuple `[paginationData, controls]`.
 *
 * @example
 * ```tsx
 * type User = { id: number; name: string };
 *
 * async function fetchUsers({
 *   current,
 *   pageSize,
 * }: {
 *   current: number;
 *   pageSize: number;
 * }) {
 *   const res = await fetch(`/api/users?page=${current}&size=${pageSize}`);
 *   return res.json() as Promise<{ total: number; list: User[] }>;
 * }
 *
 * function UserTable() {
 *   const [
 *     { data, total, current, pageSize, totalPage, loading, error },
 *     { changeCurrent, changePageSize, reload },
 *   ] = usePagination<User>(fetchUsers, { defaultPageSize: 20 });
 *
 *   if (loading) return <p>Loading…</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *
 *   return (
 *     <>
 *       <p>
 *         {total} results — page {current} of {totalPage}
 *       </p>
 *       <table>
 *         <tbody>
 *           {data.map((u) => (
 *             <tr key={u.id}>
 *               <td>{u.name}</td>
 *             </tr>
 *           ))}
 *         </tbody>
 *       </table>
 *       <button disabled={current <= 1} onClick={() => changeCurrent(current - 1)}>
 *         Prev
 *       </button>
 *       <button
 *         disabled={current >= totalPage}
 *         onClick={() => changeCurrent(current + 1)}
 *       >
 *         Next
 *       </button>
 *       <select
 *         value={pageSize}
 *         onChange={(e) => changePageSize(Number(e.target.value))}
 *       >
 *         {[10, 20, 50].map((s) => (
 *           <option key={s} value={s}>
 *             {s} / page
 *           </option>
 *         ))}
 *       </select>
 *       <button onClick={reload}>Refresh</button>
 *     </>
 *   );
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/usePagination
 */
function usePagination<TData = unknown>(
  service: PaginationService<TData>,
  options: UsePaginationOptions = {}
): UsePaginationReturn<TData> {
  const {
    defaultPageSize = 10,
    defaultCurrent = 1,
    manual = false,
  } = options;

  const [current, setCurrent] = useState(defaultCurrent);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [data, setData] = useState<TData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Always holds the latest service without making fetchData depend on it
  const serviceRef = useRef(service);
  serviceRef.current = service;

  // Mirror state into refs so callbacks read fresh values without stale closures
  const currentRef = useRef(current);
  currentRef.current = current;
  const pageSizeRef = useRef(pageSize);
  pageSizeRef.current = pageSize;

  // Tracks whether the component is still mounted
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Monotonically-increasing counter: incrementing it cancels any in-flight
  // request because stale callbacks check `generation === generationRef.current`
  const generationRef = useRef(0);

  const fetchData = useCallback(
    async (fetchCurrent: number, fetchPageSize: number): Promise<void> => {
      const generation = ++generationRef.current;

      setLoading(true);
      setError(null);

      try {
        const result = await serviceRef.current({
          current: fetchCurrent,
          pageSize: fetchPageSize,
        });

        if (mountedRef.current && generation === generationRef.current) {
          setData(result.list);
          setTotal(result.total);
          setLoading(false);
        }
      } catch (err) {
        if (mountedRef.current && generation === generationRef.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    },
    // fetchData only closes over refs and stable setState functions — [] is correct
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Auto-fetch on mount unless manual mode is requested
  useEffect(() => {
    if (!manual) {
      void fetchData(defaultCurrent, defaultPageSize);
    }
    // Intentionally run only once on mount; defaultCurrent/defaultPageSize are
    // "initial values" by design, analogous to useState's initializer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = useCallback(
    (newCurrent: number, newPageSize: number): void => {
      setCurrent(newCurrent);
      setPageSize(newPageSize);
      void fetchData(newCurrent, newPageSize);
    },
    [fetchData]
  );

  const changeCurrent = useCallback(
    (newCurrent: number): void => {
      setCurrent(newCurrent);
      void fetchData(newCurrent, pageSizeRef.current);
    },
    [fetchData]
  );

  const changePageSize = useCallback(
    (newPageSize: number): void => {
      setPageSize(newPageSize);
      setCurrent(1);
      void fetchData(1, newPageSize);
    },
    [fetchData]
  );

  const reload = useCallback((): void => {
    void fetchData(currentRef.current, pageSizeRef.current);
  }, [fetchData]);

  const run = useCallback(
    (params?: { current?: number; pageSize?: number }): void => {
      const runCurrent = params?.current ?? currentRef.current;
      const runPageSize = params?.pageSize ?? pageSizeRef.current;
      setCurrent(runCurrent);
      setPageSize(runPageSize);
      void fetchData(runCurrent, runPageSize);
    },
    [fetchData]
  );

  const cancel = useCallback((): void => {
    // Invalidate any in-flight fetch by bumping the generation counter
    generationRef.current++;
    if (mountedRef.current) {
      setLoading(false);
    }
  }, []);

  const totalPage = pageSize > 0 ? Math.ceil(total / pageSize) : 0;

  const paginationData: PaginationData<TData> = {
    data,
    total,
    current,
    pageSize,
    totalPage,
    loading,
    error,
  };

  const controls: PaginationControls = {
    onChange,
    changeCurrent,
    changePageSize,
    reload,
    run,
    cancel,
  };

  return [paginationData, controls];
}

export { usePagination };
export type {
  PaginationService,
  UsePaginationOptions,
  PaginationData,
  PaginationControls,
  UsePaginationReturn,
};
