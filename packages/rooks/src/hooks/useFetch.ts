import { useState, useCallback, useRef, useEffect } from "react";

/**
 * HTTP error interface extending Error with status information
 */
interface HttpError extends Error {
    status: number;
    statusText: string;
}

/**
 * Options for the useFetch hook
 */
interface UseFetchOptions<T = unknown> extends Omit<RequestInit, 'signal'> {
    method?: string;
    headers?: Record<string, string>;
    body?: string | FormData | URLSearchParams;
    cache?: RequestCache;
    credentials?: RequestCredentials;
    mode?: RequestMode;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    integrity?: string;
    keepalive?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    onFetch?: () => void;
}

/**
 * Return value for the useFetch hook
 */
interface UseFetchReturnValue<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    startFetch: () => Promise<void>;
}

/**
 * Creates a fetch promise with error handling and JSON parsing.
 * @param url - The URL to fetch
 * @param options - The fetch options
 * @returns A promise that resolves with the parsed JSON data or rejects with an error
 */
async function createFetchPromise<T>(
    url: string,
    options: UseFetchOptions<T> = {},
    signal?: AbortSignal
): Promise<T> {
    const requestOptions = { ...options };
    delete requestOptions.onSuccess;
    delete requestOptions.onError;
    delete requestOptions.onFetch;

    const response = await fetch(url, {
        ...requestOptions,
        signal,
    });

    if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        const httpError = new Error(errorMessage) as HttpError;
        httpError.status = response.status;
        httpError.statusText = response.statusText;
        throw httpError;
    }

    return await response.json() as T;
}

/**
 * Hook for fetching data from URLs
 *
 * This hook provides a simple way to fetch data with proper TypeScript generics,
 * error handling, and automatic JSON parsing. It manages loading states and
 * provides a fetch function for manual data fetching.
 *
 * Note: This hook does not cache requests - each call triggers a fresh fetch.
 * Unmounting aborts active requests. The hook does not automatically fetch on
 * mount. The returned startFetch function is bound to the URL and options
 * object from its render, so memoize options before using startFetch as an
 * effect dependency.
 *
 * @param url - The URL to fetch data from
 * @param options - Optional fetch configuration including callbacks
 * @returns Object containing data, loading state, error, and fetch function
 *
 * @example
 * ```tsx
 * function UserProfile({ userId }: { userId: string }) {
 *   const fetchOptions = useMemo(() => ({
 *     headers: { 'Authorization': 'Bearer token' },
 *     onSuccess: (data: User) => console.log('User loaded:', data),
 *     onError: (error: Error) => console.error('Failed to load user:', error),
 *     onFetch: () => console.log('Fetching user data...')
 *   }), []);
 *
 *   const { data: user, loading, error, startFetch } = useFetch<User>(
 *     `https://api.example.com/users/${userId}`,
 *     fetchOptions
 *   );
 *
 *   // Fetch data when component mounts or when needed
 *   useEffect(() => {
 *     startFetch();
 *   }, [startFetch]);
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!user) return <div>No user data</div>;
 *
 *   return (
 *     <div>
 *       <h1>{user.name}</h1>
 *       <p>{user.email}</p>
 *       <button onClick={startFetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
function useFetch<T = unknown>(
    url: string,
    options: UseFetchOptions<T> = {}
): UseFetchReturnValue<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const mountedRef = useRef(true);
    const mountGenerationRef = useRef(0);
    const abortControllersRef = useRef<Set<AbortController>>(new Set());

    const fetchData = useCallback(async () => {
        if (!mountedRef.current) return;
        const mountGeneration = mountGenerationRef.current;

        setLoading(true);
        setError(null);
        options.onFetch?.();

        if (
            !mountedRef.current ||
            mountGeneration !== mountGenerationRef.current
        ) {
            return;
        }

        let abortController: AbortController | null = null;
        const canCommitResult = () =>
            mountedRef.current &&
            mountGeneration === mountGenerationRef.current &&
            !abortController?.signal.aborted;

        try {
            abortController = new AbortController();
            abortControllersRef.current.add(abortController);
            const result = await createFetchPromise<T>(
                url,
                options,
                abortController.signal
            );

            if (canCommitResult()) {
                setData(result);
                options.onSuccess?.(result);
            }
        } catch (err) {
            const fetchError = err instanceof Error
                ? err
                : new Error(String(err));

            if (canCommitResult()) {
                setError(fetchError);
                options.onError?.(fetchError);
            }
        } finally {
            if (abortController) {
                abortControllersRef.current.delete(abortController);
            }

            if (canCommitResult()) {
                setLoading(false);
            }
        }
    }, [options, url]);

    useEffect(() => {
        mountedRef.current = true;
        const abortControllers = abortControllersRef.current;

        return () => {
            mountedRef.current = false;
            mountGenerationRef.current += 1;
            for (const abortController of abortControllers) {
                abortController.abort();
            }
            abortControllers.clear();
        };
    }, []);

    return {
        data,
        loading,
        error,
        startFetch: fetchData,
    };
}

export { useFetch };
export type { UseFetchOptions, UseFetchReturnValue, HttpError };
