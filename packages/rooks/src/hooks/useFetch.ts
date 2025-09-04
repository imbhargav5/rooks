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
interface UseFetchOptions extends Omit<RequestInit, 'signal'> {
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
    onSuccess?: (data: any) => void;
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
function createFetchPromise<T>(
    url: string,
    options: UseFetchOptions = {}
): Promise<T> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, {
                ...options,
                signal: new AbortController().signal, // Add signal for compatibility
            });

            // Throw error for non-2xx responses
            if (!response.ok) {
                const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                const httpError = new Error(errorMessage) as HttpError;
                httpError.status = response.status;
                httpError.statusText = response.statusText;
                throw httpError;
            }

            // Parse JSON response
            const result = await response.json();
            resolve(result);
        } catch (err) {
            reject(err instanceof Error ? err : new Error(String(err)));
        }
    });
}

/**
 * Hook for fetching data from URLs
 *
 * This hook provides a simple way to fetch data with proper TypeScript generics,
 * error handling, and automatic JSON parsing. It manages loading states and
 * provides a fetch function for manual data fetching.
 *
 * Note: This hook does not cache requests - each call triggers a fresh fetch.
 * The hook does not automatically fetch on mount - use the returned fetch function.
 *
 * @param url - The URL to fetch data from
 * @param options - Optional fetch configuration including callbacks
 * @returns Object containing data, loading state, error, and fetch function
 *
 * @example
 * ```tsx
 * function UserProfile({ userId }: { userId: string }) {
 *   const { data: user, loading, error, fetch } = useFetch<User>(
 *     `https://api.example.com/users/${userId}`,
 *     {
 *       headers: { 'Authorization': 'Bearer token' },
 *       onSuccess: (data) => console.log('User loaded:', data),
 *       onError: (error) => console.error('Failed to load user:', error),
 *       onFetch: () => console.log('Fetching user data...')
 *     }
 *   );
 *
 *   // Fetch data when component mounts or when needed
 *   useEffect(() => {
 *     fetch();
 *   }, [fetch]);
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!user) return <div>No user data</div>;
 *
 *   return (
 *     <div>
 *       <h1>{user.name}</h1>
 *       <p>{user.email}</p>
 *       <button onClick={fetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
function useFetch<T = unknown>(
    url: string,
    options: UseFetchOptions = {}
): UseFetchReturnValue<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const mountedRef = useRef(true);

    const fetchData = useCallback(async () => {
        if (!mountedRef.current) return;

        setLoading(true);
        setError(null);

        // Call onFetch callback
        options.onFetch?.();

        try {
            const result = await createFetchPromise<T>(url, options);
            if (mountedRef.current) {
                setData(result);
                // Call onSuccess callback
                options.onSuccess?.(result);
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            if (mountedRef.current) {
                setError(error);
                // Call onError callback
                options.onError?.(error);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [url, options]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            mountedRef.current = false;
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
