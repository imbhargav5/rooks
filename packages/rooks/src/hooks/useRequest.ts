import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Options for the useRequest hook.
 *
 * @template TData The type of data returned by the service function.
 * @template TParams The tuple type of parameters accepted by the service function.
 */
export interface UseRequestOptions<TData, TParams extends unknown[]> {
  /**
   * When `true`, the service will NOT run automatically on mount. You must
   * call `run` or `runAsync` manually.
   * @default false
   */
  manual?: boolean;
  /**
   * Default params passed to the service on the automatic mount-time run
   * (only used when `manual` is `false`).
   */
  defaultParams?: TParams;
  /**
   * Called just before each request, with the params that will be used.
   */
  onBefore?: (params: TParams) => void;
  /**
   * Called after a successful request with the result and the params used.
   */
  onSuccess?: (data: TData, params: TParams) => void;
  /**
   * Called after a failed request (after all retries) with the error and
   * the params used.
   */
  onError?: (error: Error, params: TParams) => void;
  /**
   * Called after every request (success or failure) with the params, the
   * resolved data (if any), and the error (if any).
   */
  onFinally?: (
    params: TParams,
    data: TData | undefined,
    error: Error | undefined
  ) => void;
  /**
   * If set (ms), the service is re-invoked at this interval after each
   * successful response.
   */
  pollingInterval?: number;
  /**
   * When `false`, polling is paused while the document is hidden and
   * resumes when it becomes visible again.
   * @default true
   */
  pollingWhenHidden?: boolean;
  /**
   * Number of times to retry after a failed attempt before giving up.
   * @default 0
   */
  retryCount?: number;
  /**
   * Milliseconds to wait between retry attempts.
   * @default 1000
   */
  retryInterval?: number;
  /**
   * When any value in this array changes (after mount), the service is
   * re-run with the last-used params. Behaves like `useEffect` deps.
   */
  refreshDeps?: unknown[];
  /**
   * Milliseconds to wait before setting `loading` to `true`. Useful to
   * suppress a loading flicker for fast requests.
   * @default 0
   */
  loadingDelay?: number;
}

/**
 * Controls object returned as the second element of the useRequest tuple.
 *
 * @template TData The type of data returned by the service function.
 * @template TParams The tuple type of parameters accepted by the service.
 */
export interface UseRequestControls<TData, TParams extends unknown[]> {
  /** `true` while a request is in flight (respects `loadingDelay`). */
  loading: boolean;
  /** The error from the most recent failed request, or `undefined`. */
  error: Error | undefined;
  /**
   * Trigger the service with new params. Errors are swallowed;
   * use `onError` or `runAsync` if you need to handle them directly.
   */
  run: (...params: TParams) => void;
  /**
   * Trigger the service with new params and return a Promise that
   * resolves with the data or rejects with the error.
   */
  runAsync: (...params: TParams) => Promise<TData>;
  /** Re-run the service with the last-used params (fire-and-forget). */
  refresh: () => void;
  /** Re-run the service with the last-used params, returns a Promise. */
  refreshAsync: () => Promise<TData>;
  /**
   * Cancel any in-flight request. The loading state is cleared
   * and pending callbacks will not fire.
   */
  cancel: () => void;
  /**
   * Directly set the `data` value without triggering a new request.
   * Accepts either a new value or an updater function `(prev) => next`.
   *
   * **Note:** If `TData` is itself a function type, the updater form
   * is ambiguous — pass a wrapper updater instead.
   */
  mutate: (
    updater:
      | TData
      | undefined
      | ((prev: TData | undefined) => TData | undefined)
  ) => void;
}

/**
 * Return type of `useRequest`: a tuple of `[data, controls]`.
 *
 * @template TData The type of data returned by the service function.
 * @template TParams The tuple type of parameters accepted by the service.
 */
export type UseRequestReturn<TData, TParams extends unknown[]> = [
  TData | undefined,
  UseRequestControls<TData, TParams>,
];

/**
 * Advanced data-fetching hook.
 *
 * Wraps any `(...args) => Promise<TData>` service with loading / error
 * state, cancellation, retries, polling, and lifecycle callbacks — all
 * with zero external dependencies.
 *
 * SSR-safe: on the server `loading` is `false` and `data` is `undefined`.
 * No `window` or `document` access occurs at module level.
 *
 * @template TData  Type of the resolved data.
 * @template TParams Tuple type of the service's parameters.
 *
 * @param service  An async function that performs the data fetch.
 * @param options  Optional configuration (see {@link UseRequestOptions}).
 * @returns A tuple of `[data, controls]`.
 *
 * @example
 * ```tsx
 * // Basic auto-fetching
 * const [user, { loading, error, refresh }] = useRequest(
 *   () => fetch('/api/me').then(r => r.json())
 * );
 *
 * if (loading) return <Spinner />;
 * if (error)   return <p>{error.message}</p>;
 * return <p>Hello {user?.name}</p>;
 * ```
 *
 * @example
 * ```tsx
 * // Manual trigger with typed params
 * const [data, { run, loading }] = useRequest(
 *   (id: number) => fetchUser(id),
 *   { manual: true }
 * );
 *
 * return <button onClick={() => run(42)}>Load user 42</button>;
 * ```
 *
 * @example
 * ```tsx
 * // Polling every 5 seconds, paused when tab is hidden
 * const [metrics, { cancel }] = useRequest(fetchMetrics, {
 *   pollingInterval: 5000,
 *   pollingWhenHidden: false,
 * });
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/useRequest
 */
function useRequest<TData = unknown, TParams extends unknown[] = unknown[]>(
  service: (...args: TParams) => Promise<TData>,
  options: UseRequestOptions<TData, TParams> = {}
): UseRequestReturn<TData, TParams> {
  const {
    manual = false,
    defaultParams,
    pollingInterval,
    pollingWhenHidden = true,
    retryCount = 0,
    retryInterval = 1000,
    refreshDeps,
    loadingDelay = 0,
  } = options;

  // ── State ────────────────────────────────────────────────────────────────
  const [data, setData] = useState<TData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  // ── Refs ─────────────────────────────────────────────────────────────────
  /**
   * Monotonically-increasing counter.  Each new `runAsync` call captures
   * the current value.  Incrementing this value "cancels" any prior request
   * because the prior call's callbacks check `requestIdRef.current === id`.
   */
  const requestIdRef = useRef<number>(0);

  /** The params used in the most recent call – used by `refresh`. */
  const lastParamsRef = useRef<TParams>((defaultParams ?? []) as TParams);

  // Fresh-ref wrappers so callbacks never go stale inside async closures.
  const serviceRef = useRef(service);
  const onBeforeRef = useRef(options.onBefore);
  const onSuccessRef = useRef(options.onSuccess);
  const onErrorRef = useRef(options.onError);
  const onFinallyRef = useRef(options.onFinally);

  useEffect(() => {
    serviceRef.current = service;
  });
  useEffect(() => {
    onBeforeRef.current = options.onBefore;
  });
  useEffect(() => {
    onSuccessRef.current = options.onSuccess;
  });
  useEffect(() => {
    onErrorRef.current = options.onError;
  });
  useEffect(() => {
    onFinallyRef.current = options.onFinally;
  });

  // Timer handles
  const pollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const visibilityListenerRef = useRef<(() => void) | null>(null);

  // ── Internal helpers ──────────────────────────────────────────────────────
  const clearPollingTimer = useCallback(() => {
    if (pollingTimerRef.current !== null) {
      clearTimeout(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
  }, []);

  const clearLoadingDelayTimer = useCallback(() => {
    if (loadingDelayTimerRef.current !== null) {
      clearTimeout(loadingDelayTimerRef.current);
      loadingDelayTimerRef.current = null;
    }
  }, []);

  const clearVisibilityListener = useCallback(() => {
    if (
      visibilityListenerRef.current !== null &&
      typeof document !== "undefined"
    ) {
      document.removeEventListener(
        "visibilitychange",
        visibilityListenerRef.current
      );
      visibilityListenerRef.current = null;
    }
  }, []);

  // ── Public API ────────────────────────────────────────────────────────────
  const cancel = useCallback(() => {
    requestIdRef.current += 1;
    clearLoadingDelayTimer();
    clearPollingTimer();
    clearVisibilityListener();
    setLoading(false);
  }, [clearLoadingDelayTimer, clearPollingTimer, clearVisibilityListener]);

  const runAsync = useCallback(
    async (...params: TParams): Promise<TData> => {
      // SSR guard: window is not available; return a rejected promise so
      // callers do not get an unhandled exception silently.
      if (typeof window === "undefined") {
        return Promise.reject(
          new Error("useRequest: service cannot run on the server")
        );
      }

      // Capture and advance the request counter.
      const requestId = ++requestIdRef.current;
      lastParamsRef.current = params;

      // Cancel any timers from a prior run.
      clearLoadingDelayTimer();
      clearPollingTimer();
      clearVisibilityListener();

      onBeforeRef.current?.(params);

      // Set loading state — optionally delayed to suppress flicker.
      if (loadingDelay > 0) {
        loadingDelayTimerRef.current = setTimeout(() => {
          if (requestIdRef.current === requestId) {
            setLoading(true);
          }
        }, loadingDelay);
      } else {
        setLoading(true);
      }

      setError(undefined);

      // ── Retry loop ─────────────────────────────────────────────────────
      const maxAttempts = retryCount + 1;
      let attempts = 0;
      let lastError: Error | undefined;

      while (attempts < maxAttempts) {
        // Bail early if the request has been superseded.
        if (requestIdRef.current !== requestId) {
          throw new DOMException("Cancelled", "AbortError");
        }

        try {
          const result = await serviceRef.current(...params);

          // Check again: the service may have taken a while.
          if (requestIdRef.current !== requestId) {
            throw new DOMException("Cancelled", "AbortError");
          }

          // ── Success ──────────────────────────────────────────────────
          clearLoadingDelayTimer();
          setData(result);
          setLoading(false);
          setError(undefined);

          onSuccessRef.current?.(result, params);
          onFinallyRef.current?.(params, result, undefined);

          // Schedule the next poll (if enabled).
          if (pollingInterval != null && pollingInterval > 0) {
            const scheduleNextPoll = () => {
              pollingTimerRef.current = setTimeout(() => {
                // Only poll if this request is still the active one.
                if (requestIdRef.current === requestId) {
                  void runAsync(...lastParamsRef.current);
                }
              }, pollingInterval);
            };

            if (
              !pollingWhenHidden &&
              typeof document !== "undefined" &&
              document.visibilityState === "hidden"
            ) {
              // Defer poll until the tab regains focus.
              const onVisible = () => {
                if (
                  typeof document !== "undefined" &&
                  document.visibilityState === "visible"
                ) {
                  clearVisibilityListener();
                  scheduleNextPoll();
                }
              };
              visibilityListenerRef.current = onVisible;
              document.addEventListener("visibilitychange", onVisible);
            } else {
              scheduleNextPoll();
            }
          }

          return result;
        } catch (err) {
          // Never retry a cancellation.
          if (err instanceof DOMException && err.name === "AbortError") {
            throw err;
          }
          if (requestIdRef.current !== requestId) {
            throw new DOMException("Cancelled", "AbortError");
          }

          lastError = err instanceof Error ? err : new Error(String(err));
          attempts += 1;

          if (attempts < maxAttempts) {
            // Wait between retries, but remain cancellable.
            await new Promise<void>((resolve) =>
              setTimeout(resolve, retryInterval)
            );
            // Confirm still active after waiting.
            if (requestIdRef.current !== requestId) {
              throw new DOMException("Cancelled", "AbortError");
            }
          }
        }
      }

      // ── All retries exhausted ───────────────────────────────────────────
      const finalError = lastError ?? new Error("Unknown error");
      clearLoadingDelayTimer();
      setLoading(false);
      setError(finalError);

      onErrorRef.current?.(finalError, params);
      onFinallyRef.current?.(params, undefined, finalError);

      throw finalError;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      clearLoadingDelayTimer,
      clearPollingTimer,
      clearVisibilityListener,
      loadingDelay,
      pollingInterval,
      pollingWhenHidden,
      retryCount,
      retryInterval,
    ]
  );

  const run = useCallback(
    (...params: TParams): void => {
      void runAsync(...params).catch(() => {
        // Errors are surfaced via the `error` state and `onError` callback.
        // Swallow here to keep `run` truly fire-and-forget.
      });
    },
    [runAsync]
  );

  const refresh = useCallback((): void => {
    run(...lastParamsRef.current);
  }, [run]);

  const refreshAsync = useCallback((): Promise<TData> => {
    return runAsync(...lastParamsRef.current);
  }, [runAsync]);

  const mutate = useCallback(
    (
      updater:
        | TData
        | undefined
        | ((prev: TData | undefined) => TData | undefined)
    ): void => {
      if (typeof updater === "function") {
        setData((prev) =>
          (updater as (prev: TData | undefined) => TData | undefined)(prev)
        );
      } else {
        setData(updater);
      }
    },
    []
  );

  // ── Effects ───────────────────────────────────────────────────────────────

  // Global cleanup on unmount.
  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      clearPollingTimer();
      clearVisibilityListener();
      clearLoadingDelayTimer();
    };
  }, [clearPollingTimer, clearVisibilityListener, clearLoadingDelayTimer]);

  // Automatic run on mount (when manual=false).
  useEffect(() => {
    if (!manual) {
      run(...((defaultParams ?? []) as TParams));
    }
    // Intentionally empty deps: we only want to fire once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run when refreshDeps change, but NOT on the initial mount.
  const hasMountedForDepsRef = useRef(false);
  useEffect(() => {
    if (!hasMountedForDepsRef.current) {
      hasMountedForDepsRef.current = true;
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refreshDeps ?? []);

  return [
    data,
    {
      loading,
      error,
      run,
      runAsync,
      refresh,
      refreshAsync,
      cancel,
      mutate,
    },
  ];
}

export { useRequest };
