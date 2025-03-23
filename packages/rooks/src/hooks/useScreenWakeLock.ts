import { useCallback, useEffect, useRef, useState } from "react";

export type ScreenWakeLockHandler = {
    request: () => Promise<boolean>;
    release: () => Promise<boolean>;
    isActive: boolean;
    error: Error | null;
    isSupported: boolean;
};

/**
 * useScreenWakeLock
 * @description A hook to prevent the screen from sleeping
 * @returns {ScreenWakeLockHandler} Methods and state for controlling screen wake lock
 * @see {@link https://rooks.vercel.app/docs/useScreenWakeLock}
 *
 * @example
 *
 * const { 
 *   request, 
 *   release, 
 *   isActive, 
 *   error 
 * } = useScreenWakeLock();
 *
 * // Prevent screen from sleeping
 * request();
 *
 * // Release when done
 * release();
 */
function useScreenWakeLock(): ScreenWakeLockHandler {
    const [error, setError] = useState<Error | null>(null);
    const [isActive, setIsActive] = useState<boolean>(false);

    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const isSupported = typeof navigator !== "undefined" &&
        "wakeLock" in navigator &&
        typeof navigator.wakeLock?.request === "function";

    // Clean up the wake lock if component unmounts
    useEffect(() => {
        return () => {
            if (wakeLockRef.current) {
                wakeLockRef.current.release().catch(() => {
                    // Ignore release errors during unmount
                });
            }
        };
    }, []);

    const handleVisibilityChange = useCallback(() => {
        if (wakeLockRef.current && document.visibilityState === "visible") {
            // Reacquire wake lock when document becomes visible again
            request().catch(() => {
                // Ignore errors during visibility change
            });
        }
    }, [/* eslint-disable-line react-hooks/exhaustive-deps */]);

    // Reacquire wake lock when visibility changes
    useEffect(() => {
        if (isSupported) {
            document.addEventListener("visibilitychange", handleVisibilityChange);

            return () => {
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        }
        return undefined;
    }, [isSupported, handleVisibilityChange]);

    const request = useCallback(async (): Promise<boolean> => {
        if (!isSupported) {
            const error = new Error("Screen Wake Lock API is not supported in this browser");
            setError(error);
            return false;
        }

        try {
            // Release any existing wake lock first
            if (wakeLockRef.current) {
                await wakeLockRef.current.release();
            }

            // @ts-ignore - TypeScript doesn't recognize these APIs in many environments
            const wakeLock = await navigator.wakeLock.request("screen");

            wakeLockRef.current = wakeLock;
            setIsActive(true);

            // Set up a listener for when the wake lock is released
            wakeLock.addEventListener("release", () => {
                setIsActive(false);
                wakeLockRef.current = null;
            });

            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            setIsActive(false);
            return false;
        }
    }, [isSupported]);

    const release = useCallback(async (): Promise<boolean> => {
        if (!isSupported) {
            return false;
        }

        if (!wakeLockRef.current) {
            return true; // Already released
        }

        try {
            await wakeLockRef.current.release();
            wakeLockRef.current = null;
            setIsActive(false);
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return false;
        }
    }, [isSupported]);

    return {
        request,
        release,
        isActive,
        error,
        isSupported
    };
}

// Define interfaces for TypeScript compatibility in environments that don't have them
interface WakeLockSentinel extends EventTarget {
    released: boolean;
    release(): Promise<void>;
    addEventListener(type: "release", listener: EventListenerOrEventListenerObject): void;
    removeEventListener(type: "release", listener: EventListenerOrEventListenerObject): void;
}

export { useScreenWakeLock }; 