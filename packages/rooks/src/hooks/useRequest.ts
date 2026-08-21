import type { DependencyList, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFreshRef } from "./useFreshRef";
import { useIsomorphicEffect } from "./useIsomorphicEffect";

export type PromiseService<TData, TParams extends unknown[]> = (
  ...args: TParams
) => Promise<TData>;

type RetryIntervalFunction = (attempt: number, error: Error) => number;

export type UseRequestOptions<TData, TParams extends unknown[]> = {
  manual?: boolean;
  defaultParams?: TParams;
  ready?: boolean;
  initialData?: TData;
  refreshDeps?: DependencyList;
  debounceWait?: number;
  throttleWait?: number;
  loadingDelay?: number;
  pollingInterval?: number;
  pollingWhenHidden?: boolean;
  retryCount?: number;
  retryInterval?: number | RetryIntervalFunction;
  onBefore?: (params: TParams) => void;
  onSuccess?: (data: TData, params: TParams) => void;
  onError?: (error: Error, params: TParams) => void;
  onFinally?: (params: TParams, data?: TData, error?: Error | null) => void;
};

export type UseRequestReturnValue<TData, TParams extends unknown[]> = {
  data: TData | undefined;
  error: Error | null;
  loading: boolean;
  params: TParams | undefined;
  run: (...args: TParams) => void;
  runAsync: (...args: TParams) => Promise<TData>;
  refresh: () => void;
  refreshAsync: () => Promise<TData | undefined>;
  cancel: () => void;
  mutate: (value: SetStateAction<TData | undefined>) => void;
};

type PendingCall<TData, TParams extends unknown[]> = {
  args: TParams;
  resolvers: Array<(value: TData) => void>;
  rejecters: Array<(reason?: unknown) => void>;
};

type RetryDelay = {
  timerId: number;
  reject: (reason: Error) => void;
};

type RequestLifecycle<TParams extends unknown[]> = {
  defaultParams: TParams | undefined;
  manual: boolean;
  ready: boolean;
  refreshDeps: DependencyList;
};

export type ValidUseRequestOptions<
  TData,
  TParams extends unknown[],
> = [] extends TParams
  ? UseRequestOptions<TData, TParams>
  :
      | (UseRequestOptions<TData, TParams> & { manual: true })
      | (UseRequestOptions<TData, TParams> & {
          manual?: false;
          defaultParams: TParams;
        });

const REQUEST_CANCELLED_ERROR_MESSAGE = "Request cancelled";

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function isDocumentHidden() {
  return typeof document !== "undefined" && document.hidden;
}

function createCancelledError() {
  return new Error(REQUEST_CANCELLED_ERROR_MESSAGE);
}

function callSafely<TArgs extends unknown[]>(
  callback: ((...args: TArgs) => void) | undefined,
  ...args: TArgs
) {
  try {
    callback?.(...args);
  } catch {
    // Consumer callbacks must not alter the request state machine.
  }
}

function areParamsEqual(
  firstParams: unknown[] | undefined,
  secondParams: unknown[] | undefined
) {
  if (firstParams === secondParams) {
    return true;
  }

  if (
    !firstParams ||
    !secondParams ||
    firstParams.length !== secondParams.length
  ) {
    return false;
  }

  return firstParams.every((value, index) =>
    Object.is(value, secondParams[index])
  );
}

/**
 * useRequest
 * @description Promise-request lifecycle hook with retries, polling, debounce, and throttle.
 * @see {@link https://rooks.vercel.app/docs/hooks/useRequest}
 */
function useRequest<TData, TParams extends unknown[]>(
  service: PromiseService<TData, TParams>,
  ...optionsArgs: [] extends TParams
    ? [options?: UseRequestOptions<TData, TParams>]
    : [options: ValidUseRequestOptions<TData, TParams>]
): UseRequestReturnValue<TData, TParams>;
function useRequest<TData, TParams extends unknown[]>(
  service: PromiseService<TData, TParams>,
  options: UseRequestOptions<TData, TParams> = {}
): UseRequestReturnValue<TData, TParams> {
  const {
    manual = false,
    defaultParams,
    ready = true,
    initialData,
    refreshDeps = [],
    debounceWait,
    throttleWait,
    loadingDelay = 0,
    pollingInterval,
    pollingWhenHidden = false,
    retryCount = 0,
    retryInterval = 0,
    onBefore,
    onSuccess,
    onError,
    onFinally,
  } = options;

  if (
    typeof debounceWait === "number" &&
    debounceWait > 0 &&
    typeof throttleWait === "number" &&
    throttleWait > 0
  ) {
    throw new Error(
      "useRequest does not support debounceWait and throttleWait together."
    );
  }

  const [data, setData] = useState<TData | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<TParams | undefined>(defaultParams);

  const serviceRef = useFreshRef(service);
  const defaultParamsRef = useFreshRef(defaultParams);
  const callbacksRef = useFreshRef({
    onBefore,
    onSuccess,
    onError,
    onFinally,
  });
  const settingsRef = useFreshRef({
    loadingDelay,
    pollingInterval,
    pollingWhenHidden,
    retryCount,
    retryInterval,
  });
  const dataRef = useFreshRef(data, true);
  const paramsRef = useFreshRef(params, true);

  const activeRequestIdRef = useRef(0);
  const throttleStartedAtRef = useRef(0);
  const debounceTimerRef = useRef<number | null>(null);
  const throttleTimerRef = useRef<number | null>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const pollingTimerRef = useRef<number | null>(null);
  const retryDelayRef = useRef<RetryDelay | null>(null);
  const pendingCallRef = useRef<PendingCall<TData, TParams> | null>(null);
  const pollingParamsRef = useRef<TParams | null>(null);
  const executeRef = useRef<
    ((requestParams: TParams) => Promise<TData>) | null
  >(null);
  const hasExecutedRef = useRef(false);
  const lifecycleRef = useRef<RequestLifecycle<TParams> | null>(null);

  const clearTimer = (timerRef: { current: number | null }) => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const rejectPendingCall = useCallback((reason: Error) => {
    const pendingCall = pendingCallRef.current;
    if (!pendingCall) {
      return;
    }

    pendingCallRef.current = null;
    for (const reject of pendingCall.rejecters) {
      reject(reason);
    }
  }, []);

  const cancelRetryDelay = useCallback((reason: Error) => {
    const retryDelay = retryDelayRef.current;
    if (!retryDelay) {
      return;
    }

    retryDelayRef.current = null;
    window.clearTimeout(retryDelay.timerId);
    retryDelay.reject(reason);
  }, []);

  const clearAllTimers = useCallback(() => {
    clearTimer(debounceTimerRef);
    clearTimer(throttleTimerRef);
    clearTimer(loadingTimerRef);
    clearTimer(pollingTimerRef);
    pollingParamsRef.current = null;
    cancelRetryDelay(createCancelledError());
  }, [cancelRetryDelay]);

  const cancel = useCallback(() => {
    const cancelledError = createCancelledError();
    activeRequestIdRef.current += 1;
    clearAllTimers();
    rejectPendingCall(cancelledError);
    throttleStartedAtRef.current = 0;
    setLoading(false);
  }, [clearAllTimers, rejectPendingCall]);

  const mutate = useCallback((value: SetStateAction<TData | undefined>) => {
    setData((currentData) =>
      typeof value === "function"
        ? (value as (previousData: TData | undefined) => TData | undefined)(
            currentData
          )
        : value
    );
  }, []);

  const resolveRetryInterval = useCallback(
    (attempt: number, requestError: Error) => {
      const currentRetryInterval = settingsRef.current.retryInterval;
      if (typeof currentRetryInterval === "function") {
        return currentRetryInterval(attempt, requestError);
      }

      return currentRetryInterval;
    },
    [settingsRef]
  );

  const schedulePolling = useCallback(
    (requestParams: TParams) => {
      clearTimer(pollingTimerRef);
      pollingParamsRef.current = requestParams;

      const interval = settingsRef.current.pollingInterval;
      if (typeof interval !== "number" || interval <= 0) {
        pollingParamsRef.current = null;
        return;
      }

      if (!settingsRef.current.pollingWhenHidden && isDocumentHidden()) {
        return;
      }

      pollingTimerRef.current = window.setTimeout(() => {
        pollingTimerRef.current = null;
        if (!settingsRef.current.pollingWhenHidden && isDocumentHidden()) {
          return;
        }

        const nextParams = pollingParamsRef.current;
        if (nextParams) {
          void executeRef.current?.(nextParams).catch(() => {});
        }
      }, interval);
    },
    [settingsRef]
  );

  const execute = useCallback(
    async (requestParams: TParams): Promise<TData> => {
      cancelRetryDelay(createCancelledError());
      const requestId = activeRequestIdRef.current + 1;
      activeRequestIdRef.current = requestId;
      hasExecutedRef.current = true;
      paramsRef.current = requestParams;
      setParams(requestParams);
      setError(null);

      callSafely(callbacksRef.current.onBefore, requestParams);

      clearTimer(pollingTimerRef);
      pollingParamsRef.current = null;
      clearTimer(loadingTimerRef);

      if (settingsRef.current.loadingDelay > 0) {
        loadingTimerRef.current = window.setTimeout(() => {
          if (requestId === activeRequestIdRef.current) {
            setLoading(true);
          }
        }, settingsRef.current.loadingDelay);
      } else {
        setLoading(true);
      }

      const runAttempt = async (attempt: number): Promise<TData> => {
        try {
          const result = await serviceRef.current(...requestParams);

          if (requestId !== activeRequestIdRef.current) {
            throw createCancelledError();
          }

          clearTimer(loadingTimerRef);
          setData(result);
          setError(null);
          setLoading(false);
          callSafely(callbacksRef.current.onSuccess, result, requestParams);
          schedulePolling(requestParams);
          callSafely(
            callbacksRef.current.onFinally,
            requestParams,
            result,
            null
          );

          return result;
        } catch (requestError) {
          const normalizedError = toError(requestError);
          const shouldRetry =
            attempt < settingsRef.current.retryCount &&
            requestId === activeRequestIdRef.current;

          if (shouldRetry) {
            let interval: number;
            try {
              interval = resolveRetryInterval(attempt + 1, normalizedError);
            } catch (retryIntervalError) {
              const finalError = toError(retryIntervalError);
              if (requestId === activeRequestIdRef.current) {
                clearTimer(loadingTimerRef);
                setError(finalError);
                setLoading(false);
                callSafely(
                  callbacksRef.current.onError,
                  finalError,
                  requestParams
                );
                callSafely(
                  callbacksRef.current.onFinally,
                  requestParams,
                  undefined,
                  finalError
                );
              }
              throw finalError;
            }

            await new Promise<void>((resolve, reject) => {
              const timerId = window.setTimeout(
                () => {
                  if (retryDelayRef.current?.timerId === timerId) {
                    retryDelayRef.current = null;
                  }
                  resolve();
                },
                Math.max(0, interval)
              );
              retryDelayRef.current = {
                timerId,
                reject,
              };
            });

            if (requestId !== activeRequestIdRef.current) {
              throw createCancelledError();
            }

            return runAttempt(attempt + 1);
          }

          if (requestId === activeRequestIdRef.current) {
            clearTimer(loadingTimerRef);
            setError(normalizedError);
            setLoading(false);
            callSafely(
              callbacksRef.current.onError,
              normalizedError,
              requestParams
            );
            schedulePolling(requestParams);
            callSafely(
              callbacksRef.current.onFinally,
              requestParams,
              undefined,
              normalizedError
            );
          }

          throw normalizedError;
        }
      };

      return runAttempt(0);
    },
    [
      callbacksRef,
      cancelRetryDelay,
      paramsRef,
      resolveRetryInterval,
      schedulePolling,
      serviceRef,
      settingsRef,
    ]
  );

  useIsomorphicEffect(() => {
    executeRef.current = execute;
    return () => {
      executeRef.current = null;
    };
  }, [execute]);

  const invokePendingCall = useCallback(() => {
    const pendingCall = pendingCallRef.current;
    if (!pendingCall) {
      return;
    }

    pendingCallRef.current = null;
    throttleStartedAtRef.current = Date.now();

    void execute(pendingCall.args)
      .then((result) => {
        for (const resolve of pendingCall.resolvers) {
          resolve(result);
        }
      })
      .catch((requestError) => {
        for (const reject of pendingCall.rejecters) {
          reject(requestError);
        }
      });
  }, [execute]);

  const scheduleInvocation = useCallback(
    (...requestParams: TParams): Promise<TData> => {
      return new Promise<TData>((resolve, reject) => {
        const currentPendingCall = pendingCallRef.current;

        if (
          currentPendingCall &&
          typeof debounceWait === "number" &&
          debounceWait > 0
        ) {
          currentPendingCall.args = requestParams;
          currentPendingCall.resolvers.push(resolve);
          currentPendingCall.rejecters.push(reject);
          clearTimer(debounceTimerRef);
          debounceTimerRef.current = window.setTimeout(() => {
            invokePendingCall();
          }, debounceWait);
          return;
        }

        if (
          currentPendingCall &&
          typeof throttleWait === "number" &&
          throttleWait > 0
        ) {
          currentPendingCall.args = requestParams;
          currentPendingCall.resolvers.push(resolve);
          currentPendingCall.rejecters.push(reject);
          return;
        }

        pendingCallRef.current = {
          args: requestParams,
          resolvers: [resolve],
          rejecters: [reject],
        };

        if (typeof debounceWait === "number" && debounceWait > 0) {
          clearTimer(debounceTimerRef);
          debounceTimerRef.current = window.setTimeout(() => {
            invokePendingCall();
          }, debounceWait);
          return;
        }

        if (typeof throttleWait === "number" && throttleWait > 0) {
          const elapsed = Date.now() - throttleStartedAtRef.current;

          if (elapsed >= throttleWait || throttleStartedAtRef.current === 0) {
            invokePendingCall();
            return;
          }

          if (throttleTimerRef.current === null) {
            throttleTimerRef.current = window.setTimeout(() => {
              throttleTimerRef.current = null;
              invokePendingCall();
            }, throttleWait - elapsed);
          }
          return;
        }

        invokePendingCall();
      });
    },
    [debounceWait, invokePendingCall, throttleWait]
  );

  const runAsync = useCallback(
    (...requestParams: TParams) => {
      clearTimer(pollingTimerRef);
      pollingParamsRef.current = null;
      return scheduleInvocation(...requestParams);
    },
    [scheduleInvocation]
  );

  const run = useCallback(
    (...requestParams: TParams) => {
      void runAsync(...requestParams).catch(() => {});
    },
    [runAsync]
  );

  const refreshAsync = useCallback(async () => {
    const nextParams = hasExecutedRef.current
      ? paramsRef.current
      : defaultParamsRef.current;

    if (!nextParams) {
      return dataRef.current;
    }

    return runAsync(...nextParams);
  }, [dataRef, defaultParamsRef, paramsRef, runAsync]);

  const refresh = useCallback(() => {
    void refreshAsync().catch(() => {});
  }, [refreshAsync]);

  useEffect(() => {
    return () => {
      activeRequestIdRef.current += 1;
      clearAllTimers();
      rejectPendingCall(createCancelledError());
      lifecycleRef.current = null;
    };
  }, [clearAllTimers, rejectPendingCall]);

  useEffect(() => {
    const currentPollingParams = pollingParamsRef.current;
    clearTimer(pollingTimerRef);
    if (currentPollingParams) {
      schedulePolling(currentPollingParams);
    }

    if (typeof document === "undefined" || pollingWhenHidden) {
      return () => {};
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimer(pollingTimerRef);
        return;
      }

      const nextParams = pollingParamsRef.current;
      if (nextParams && pollingTimerRef.current === null) {
        schedulePolling(nextParams);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pollingInterval, pollingWhenHidden, schedulePolling]);

  useEffect(() => {
    const previous = lifecycleRef.current;
    const current: RequestLifecycle<TParams> = {
      defaultParams: defaultParamsRef.current,
      manual,
      ready,
      refreshDeps: Array.from(refreshDeps),
    };
    lifecycleRef.current = current;

    const runAutomatically = () => {
      const nextParams = defaultParamsRef.current;
      if (!nextParams && serviceRef.current.length > 0) {
        return;
      }
      void runAsync(...(nextParams ?? ([] as unknown as TParams))).catch(
        () => {}
      );
    };

    if (!previous) {
      if (!manual && ready) {
        runAutomatically();
      }
      return;
    }

    if (!ready) {
      if (previous.ready) {
        cancel();
      }
      return;
    }

    const becameReady = !previous.ready;
    const becameAutomatic = previous.manual && !manual;
    const defaultParamsChanged = !areParamsEqual(
      previous.defaultParams,
      current.defaultParams
    );
    const refreshDepsChanged = !areParamsEqual(
      Array.from(previous.refreshDeps),
      Array.from(current.refreshDeps)
    );

    if (!manual && (becameReady || becameAutomatic || defaultParamsChanged)) {
      runAutomatically();
      return;
    }

    if (refreshDepsChanged && !becameReady) {
      void refreshAsync().catch(() => {});
    }
  });

  return {
    data,
    error,
    loading,
    params,
    run,
    runAsync,
    refresh,
    refreshAsync,
    cancel,
    mutate,
  };
}

export { useRequest };
