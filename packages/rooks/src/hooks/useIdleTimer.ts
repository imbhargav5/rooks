import { useState, useCallback, useEffect, useRef } from "react";

export type IdleTimerOptions = {
    timeout?: number;
    onIdle?: () => void;
    onActive?: () => void;
    events?: string[];
    debounce?: number;
};

export type IdleTimerHandler = {
    isIdle: boolean;
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
    getRemainingTime: () => number;
    getElapsedTime: () => number;
    getLastActiveTime: () => Date;
};

/**
 * useIdleTimer
 * @description A hook for tracking user idle state
 * @param {IdleTimerOptions} options Configuration options for the idle timer
 * @returns {IdleTimerHandler} Handler functions and state for the idle timer
 * @see {@link https://rooks.vercel.app/docs/useIdleTimer}
 *
 * @example
 *
 * const { isIdle, resetTimer } = useIdleTimer({
 *   timeout: 3000,
 *   onIdle: () => console.log('User is idle'),
 *   onActive: () => console.log('User is active'),
 * });
 * 
 * return (
 *   <div>
 *     <p>{isIdle ? 'User is idle' : 'User is active'}</p>
 *     <button onClick={resetTimer}>Reset Timer</button>
 *   </div>
 * );
 */
function useIdleTimer(options: IdleTimerOptions = {}): IdleTimerHandler {
    const {
        timeout = 60000, // Default timeout of 1 minute
        onIdle,
        onActive,
        events = [
            "mousemove",
            "mousedown",
            "keydown",
            "touchstart",
            "wheel",
            "scroll",
        ],
        debounce = 100,
    } = options;

    const [isIdle, setIsIdle] = useState(false);
    const timerRef = useRef<number | null>(null);
    const timeoutTrackerRef = useRef<number | null>(null);
    const lastActiveTime = useRef(new Date());
    const idleStartTimeRef = useRef<Date | null>(null);
    const isRunning = useRef(false);
    const debouncedHandlerRef = useRef<number | null>(null);

    // Clear all existing timers
    const clearTimers = useCallback(() => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (timeoutTrackerRef.current) {
            window.clearInterval(timeoutTrackerRef.current);
            timeoutTrackerRef.current = null;
        }
        if (debouncedHandlerRef.current) {
            window.clearTimeout(debouncedHandlerRef.current);
            debouncedHandlerRef.current = null;
        }
    }, []);

    // Start the idle timer
    const startTimer = useCallback(() => {
        if (isRunning.current) return;

        isRunning.current = true;

        // Reset the timer
        clearTimers();

        // Set the timer
        timerRef.current = window.setTimeout(() => {
            setIsIdle(true);
            idleStartTimeRef.current = new Date();
            onIdle && onIdle();
        }, timeout);
    }, [timeout, onIdle, clearTimers]);

    // Stop the idle timer
    const stopTimer = useCallback(() => {
        isRunning.current = false;
        clearTimers();
    }, [clearTimers]);

    // Reset the timer
    const resetTimer = useCallback(() => {
        if (!isRunning.current) return;

        // Update last active time
        lastActiveTime.current = new Date();

        // If currently idle, switch to active
        if (isIdle) {
            setIsIdle(false);
            idleStartTimeRef.current = null;
            onActive && onActive();
        }

        // Reset the timer
        clearTimers();

        // Set the timer again
        timerRef.current = window.setTimeout(() => {
            setIsIdle(true);
            idleStartTimeRef.current = new Date();
            onIdle && onIdle();
        }, timeout);
    }, [timeout, onIdle, onActive, isIdle, clearTimers]);

    // Handle user activity with debounce
    const handleUserActivity = useCallback(() => {
        if (debouncedHandlerRef.current) {
            window.clearTimeout(debouncedHandlerRef.current);
        }

        debouncedHandlerRef.current = window.setTimeout(() => {
            resetTimer();
        }, debounce);
    }, [resetTimer, debounce]);

    // Get the remaining time until idle in milliseconds
    const getRemainingTime = useCallback((): number => {
        if (!isRunning.current || isIdle) return 0;

        const now = new Date();
        const elapsed = now.getTime() - lastActiveTime.current.getTime();
        return Math.max(0, timeout - elapsed);
    }, [isIdle, timeout]);

    // Get the elapsed time since becoming idle in milliseconds
    const getElapsedTime = useCallback((): number => {
        if (!isIdle || !idleStartTimeRef.current) return 0;

        const now = new Date();
        return now.getTime() - idleStartTimeRef.current.getTime();
    }, [isIdle]);

    // Get the time of last activity
    const getLastActiveTime = useCallback((): Date => {
        return lastActiveTime.current;
    }, []);

    // Set up and clean up event listeners
    useEffect(() => {
        // Start the timer initially
        startTimer();

        // Add event listeners
        events.forEach((event) => {
            window.addEventListener(event, handleUserActivity);
        });

        // Clean up
        return () => {
            clearTimers();
            events.forEach((event) => {
                window.removeEventListener(event, handleUserActivity);
            });
        };
    }, [events, startTimer, handleUserActivity, clearTimers]);

    return {
        isIdle,
        startTimer,
        stopTimer,
        resetTimer,
        getRemainingTime,
        getElapsedTime,
        getLastActiveTime,
    };
}

export { useIdleTimer }; 