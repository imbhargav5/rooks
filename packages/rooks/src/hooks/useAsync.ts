import { useCallback, useEffect, useState } from "react";

export type AsyncStatus = "idle" | "pending" | "success" | "error";

export type AsyncHandler<T> = {
    execute: (...args: any[]) => Promise<T | undefined>;
    status: AsyncStatus;
    value: T | undefined;
    error: Error | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    isIdle: boolean;
    reset: () => void;
};

/**
 * useAsync
 * @description A hook for async data fetching with loading/error states
 * @param {Function} asyncFunction The async function to execute
 * @param {boolean} immediate Whether to execute the function immediately on mount
 * @returns {AsyncHandler<T>} Methods and state for async operation management
 * @see {@link https://rooks.vercel.app/docs/useAsync}
 *
 * @example
 *
 * const {
 *   execute,
 *   status,
 *   value,
 *   error,
 *   isLoading,
 *   isSuccess,
 *   isError
 * } = useAsync(fetchUserData);
 *
 * // Manually execute if immediate is false
 * if (!isLoading) {
 *   execute();
 * }
 *
 * // Use the fetched data
 * if (isSuccess) {
 *   console.log(value);
 * }
 */
function useAsync<T>(
    asyncFunction: (...args: any[]) => Promise<T>,
    immediate: boolean = true
): AsyncHandler<T> {
    const [status, setStatus] = useState<AsyncStatus>("idle");
    const [value, setValue] = useState<T | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);

    // Reset state
    const reset = useCallback(() => {
        setStatus("idle");
        setValue(undefined);
        setError(null);
    }, []);

    // Execute the async function
    const execute = useCallback(
        async (...args: any[]): Promise<T | undefined> => {
            setStatus("pending");
            setError(null);

            try {
                const result = await asyncFunction(...args);
                setValue(result);
                setStatus("success");
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                setError(error);
                setStatus("error");
                return undefined;
            }
        },
        [asyncFunction]
    );

    // Execute the async function immediately if immediate is true
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return {
        execute,
        status,
        value,
        error,
        isLoading: status === "pending",
        isSuccess: status === "success",
        isError: status === "error",
        isIdle: status === "idle",
        reset
    };
}

export { useAsync }; 