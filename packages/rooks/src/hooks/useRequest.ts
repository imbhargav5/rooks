import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Global in-memory cache shared across all useRequest instances with the same cacheKey.
 */
const globalRequestCache = new Map<
  string,
  { data: unknown; timestamp: number }
>();

type UseRequestService<TData, TParams extends unknown[]> = (
  ...params: TParams
) => Promise<TData>;

interface UseRequestOptions<TData, TParams extends unknown[]> {
  /**
   * If true, the request must be triggered manually via run() or runAsync().
   * @default false
   */
  manual?: boolean;
  /**
   * Default parameters passed to the service on the initial auto-trigger.
   */
  defaultParams?: TParams;
  /**
   * Callback fired when the request succeeds.
   */
  onSuccess?: (data: TData, params: TParams) => void;
  /**
   * Callback fired when the request fails (after all retries are exhausted).
   */
  onError?: (error: Error, params: TParams) => void;
  /**
   * Callback fired when the request completes, whether success or failure.
   */
  onFinally?: (params: TParams, data?: TData, error?: Error) => void;
  /**
   * Cache key. When provided, successful responses are cached and shared
   * across hook instances using the same key.
   */
  cacheKey?: string;
  /**
   * Duration in ms to retain a cache entry before it is evicted.
   * @default 300000 (5 minutes)
   */
  cacheTime?: number;
  /**
   * Duration in ms during which a cached response is considered fresh and
   * returned immediately without a network request.
   * Set to 0 to always refetch (stale-while-revalidate disabled).
   * @default 0
   */
  staleTime?: number;
  /**
   * When set to a positive number, the hook automatically re-runs at that
   * interval (in ms) after each response.
   */
  pollingInterval?: number;
  /**
   * Debounce delay in ms. Calls to run() are batched; only the last call
   * within the window triggers a request.
   */
  debounceWait?: number;
  /**
   * Number of additional retry attempts on error.
   * @default 0
   */
  retryCount?: number;
  /**
   * Delay in ms between consecutive retry attempts.
   * @default 1000
   */
  retryInterval?: number;
}

interface UseRequestResult<TData, TParams extends unknown[]> {
  /** True while a request is in-flight (including retries). */
  loading: boolean;
  /** The most recent successful response. */
  data: TData | undefined;
  /** The error from the most recent failed request (cleared on next run). */
  error: Error | undefined;
  /** Parameters used in the most recent invocation. */
  params: TParams | undefined;
  /** Trigger the request. Swallows the returned promise rejection. */
  run: (...params: TParams) => void;
  /** Trigger the request and return the promise. */
  runAsync: (...params: TParams) => Promise<TData>;
  /** Re-trigger using the last-used parameters. */
  refresh: () => void;
  /** Re-trigger using the last-used parameters, returns a promise. */
  refreshAsync: () => Promise<TData>;
  /**
   * Manually override the current data value without triggering a request.
   * Accepts a new value or an updater function.
   */
  mutate: (
    data: TData | ((currentData: TData | undefined) => TData | undefined)
  ) => void;
  /** Cancel the in-flight request and clear any pending debounce or retry. */
  cancel: () => void;
}

/**
 * useRequest hook
 *
 * @description Manages async data fetching with loading/error/data states.
 * Supports manual and automatic triggers, caching, polling, debounce, and retry.
 *
 * @param service - Async function that performs the request
 * @param options - Configuration options
 * @see https://rooks.vercel.app/docs/hooks/useRequest
 */
function useRequest<TData, TParams extends unknown[]>(
  service: UseRequestService<TData, TParams>,
  options: UseRequestOptions<TData, TParams> = {}
): UseRequestResult<TData, TParams> {
  // Keep the latest service and options in refs so callbacks are always fresh
  const serviceRef = useRef(service);
  serviceRef.current = service;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Compute initial data from a non-stale cache entry (if any)
  const getInitialCacheData = (): TData | undefined => {
    const { cacheKey, staleTime = 0 } = options;
    if (!cacheKey || staleTime === 0) return undefined;
    const cached = globalRequestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < staleTime) {
      return cached.data as TData;
    }
    return undefined;
  };

  const initialCachedData = getInitialCacheData();

  const [loading, setLoading] = useState<boolean>(
    // Start as loading only when auto-triggering and no fresh cache exists
    !options.manual && initialCachedData === undefined
  );
  const [data, setData] = useState<TData | undefined>(initialCachedData);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [params, setParams] = useState<TParams | undefined>(undefined);

  const isMountedRef = useRef(true);
  const cancelledRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );
  const lastParamsRef = useRef<TParams | undefined>(undefined);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cancelledRef.current = true;
      if (retryTimerRef.current !== undefined) {
        clearTimeout(retryTimerRef.current);
      }
      if (debounceTimerRef.current !== undefined) {
        clearTimeout(debounceTimerRef.current);
      }
      if (pollingTimerRef.current !== undefined) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, []);

  /**
   * Core async executor. Stable reference — reads all options from refs.
   */
  const runAsync = useCallback(async (...runParams: TParams): Promise<TData> => {
    const {
      cacheKey,
      cacheTime = 5 * 60 * 1000,
      staleTime = 0,
      retryCount = 0,
      retryInterval: retryDelayMs = 1000,
      onSuccess,
      onError,
      onFinally,
    } = optionsRef.current;

    // Cancel any pending retry from a previous call
    if (retryTimerRef.current !== undefined) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = undefined;
    }
    cancelledRef.current = false;
    lastParamsRef.current = runParams;

    if (isMountedRef.current) {
      setParams(runParams);
    }

    // Return cached data immediately if it is still within staleTime
    if (cacheKey && staleTime > 0) {
      const cached = globalRequestCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < staleTime) {
        if (isMountedRef.current) {
          setData(cached.data as TData);
          setLoading(false);
          setError(undefined);
        }
        return cached.data as TData;
      }
    }

    if (isMountedRef.current) {
      setLoading(true);
      setError(undefined);
    }

    const executeWithRetry = async (attempt: number): Promise<TData> => {
      try {
        const result = await serviceRef.current(...runParams);

        if (cancelledRef.current) {
          // Request was cancelled while awaiting; propagate silently
          throw new Error("useRequest: request cancelled");
        }

        // Populate cache
        if (cacheKey) {
          globalRequestCache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
          setTimeout(() => {
            const entry = globalRequestCache.get(cacheKey);
            if (entry && Date.now() - entry.timestamp >= cacheTime) {
              globalRequestCache.delete(cacheKey);
            }
          }, cacheTime);
        }

        if (isMountedRef.current) {
          setData(result);
          setLoading(false);
          setError(undefined);
        }

        onSuccess?.(result, runParams);
        onFinally?.(runParams, result, undefined);
        return result;
      } catch (err) {
        if (cancelledRef.current) {
          throw err;
        }

        const requestError =
          err instanceof Error ? err : new Error(String(err));

        if (attempt < retryCount) {
          return new Promise<TData>((resolve, reject) => {
            retryTimerRef.current = setTimeout(() => {
              retryTimerRef.current = undefined;
              if (!cancelledRef.current && isMountedRef.current) {
                executeWithRetry(attempt + 1).then(resolve, reject);
              } else {
                reject(new Error("useRequest: request cancelled"));
              }
            }, retryDelayMs);
          });
        }

        if (isMountedRef.current) {
          setError(requestError);
          setLoading(false);
        }
        onError?.(requestError, runParams);
        onFinally?.(runParams, undefined, requestError);
        throw requestError;
      }
    };

    return executeWithRetry(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty: all option access is via optionsRef

  /**
   * Fire-and-forget wrapper around runAsync, with optional debounce.
   */
  const run = useCallback(
    (...runParams: TParams): void => {
      const { debounceWait } = optionsRef.current;

      if (debounceWait !== undefined && debounceWait > 0) {
        if (debounceTimerRef.current !== undefined) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          debounceTimerRef.current = undefined;
          runAsync(...runParams).catch(() => {
            // errors are surfaced via the error state
          });
        }, debounceWait);
      } else {
        runAsync(...runParams).catch(() => {
          // errors are surfaced via the error state
        });
      }
    },
    [runAsync]
  );

  const refresh = useCallback((): void => {
    const p = lastParamsRef.current ?? ([] as unknown as TParams);
    run(...p);
  }, [run]);

  const refreshAsync = useCallback((): Promise<TData> => {
    const p = lastParamsRef.current ?? ([] as unknown as TParams);
    return runAsync(...p);
  }, [runAsync]);

  const mutate = useCallback(
    (
      updater: TData | ((currentData: TData | undefined) => TData | undefined)
    ): void => {
      setData((current) =>
        typeof updater === "function"
          ? (updater as (c: TData | undefined) => TData | undefined)(current)
          : updater
      );
    },
    []
  );

  const cancel = useCallback((): void => {
    cancelledRef.current = true;
    if (retryTimerRef.current !== undefined) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = undefined;
    }
    if (debounceTimerRef.current !== undefined) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = undefined;
    }
    if (isMountedRef.current) {
      setLoading(false);
    }
  }, []);

  // Auto-trigger on mount when manual=false
  useEffect(() => {
    if (!optionsRef.current.manual) {
      const initParams =
        optionsRef.current.defaultParams ?? ([] as unknown as TParams);
      runAsync(...initParams).catch(() => {
        // errors are surfaced via the error state
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Polling: restart the interval whenever pollingInterval changes
  const { pollingInterval } = options;
  useEffect(() => {
    if (pollingInterval !== undefined && pollingInterval > 0) {
      pollingTimerRef.current = setInterval(() => {
        const p = lastParamsRef.current ?? ([] as unknown as TParams);
        runAsync(...p).catch(() => {
          // errors are surfaced via the error state
        });
      }, pollingInterval);

      return () => {
        if (pollingTimerRef.current !== undefined) {
          clearInterval(pollingTimerRef.current);
          pollingTimerRef.current = undefined;
        }
      };
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollingInterval, runAsync]);

  return {
    loading,
    data,
    error,
    params,
    run,
    runAsync,
    refresh,
    refreshAsync,
    mutate,
    cancel,
  };
}

export { useRequest };
export type { UseRequestOptions, UseRequestResult, UseRequestService };
