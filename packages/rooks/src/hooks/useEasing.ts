import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRaf } from "./useRaf";

/**
 * Easing function type - takes progress (0-1) and returns eased value (0-1)
 */
type EasingFunction = (t: number) => number;

/**
 * Common easing functions
 */
const Easing = {
    linear: (t: number) => t,
    easeInQuad: (t: number) => t * t,
    easeOutQuad: (t: number) => t * (2 - t),
    easeInOutQuad: (t: number) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => --t * t * t + 1,
    easeInOutCubic: (t: number) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};

/**
 * Easing state - whether the animation is running or idle
 */
type EasingState = "idle" | "running";

/**
 * Easing direction - whether animating forward (0→1) or backward (1→0)
 */
type EasingDirection = "forward" | "backward";

/**
 * Options for useEasing hook
 */
interface UseEasingOptions {
    /** Easing function to use. Default: Easing.linear */
    easing?: EasingFunction;
    /** Whether to start animation on mount. Default: true */
    autoStart?: boolean;
    /** Whether to loop the animation. Default: false */
    loop?: boolean;
    /** Whether to alternate direction on each loop (ping-pong). Default: false */
    alternate?: boolean;
    /** Delay before starting animation in ms. Default: 0 */
    delay?: number;
    /** Callback fired each time animation reaches the end */
    onEnd?: () => void;
}

/**
 * Controls returned by useEasing hook
 */
interface EasingControls {
    /** Start or resume the animation */
    start: () => void;
    /** Stop/pause the animation at current position */
    stop: () => void;
    /** Reset to initial state (progress=0, direction=forward, endCount=0) */
    reset: () => void;
    /** Reset and start (convenience method) */
    restart: () => void;
    /** Current state: "idle" or "running" */
    state: EasingState;
    /** Current direction: "forward" or "backward" */
    direction: EasingDirection;
    /** Number of times animation has reached the end */
    endCount: number;
}

/**
 * useEasing hook
 *
 * A hook for creating controlled easing animations with start/stop/reset capabilities.
 *
 * @param duration - Duration of the animation in milliseconds
 * @param options - Configuration options
 * @returns Tuple of [progress, controls] where progress is 0-1 and controls provide animation control
 * @see https://rooks.vercel.app/docs/hooks/useEasing
 *
 * @example
 * ```tsx
 * const [progress, { start, stop, state }] = useEasing(1000, {
 *   easing: Easing.easeInOutQuad,
 *   autoStart: false,
 * });
 * ```
 */
function useEasing(
    duration: number,
    options: UseEasingOptions = {}
): [number, EasingControls] {
    const {
        easing = Easing.linear,
        autoStart = true,
        loop = false,
        alternate = false,
        delay = 0,
        onEnd,
    } = options;

    const [progress, setProgress] = useState(0);
    const [state, setState] = useState<EasingState>(autoStart ? "running" : "idle");
    const [direction, setDirection] = useState<EasingDirection>("forward");
    const [endCount, setEndCount] = useState(0);

    // Refs for animation timing
    const startTimeRef = useRef<number | null>(null);
    const pausedRawProgressRef = useRef(0); // Raw progress (before easing) for resume
    const delayRemainingRef = useRef(delay);
    const isFirstRunRef = useRef(true);
    const hasCompletedRef = useRef(false); // Track if current iteration completed
    const currentRawProgressRef = useRef(0); // Track current raw progress for stop()

    // Refs for stable callbacks
    const onEndRef = useRef(onEnd);
    onEndRef.current = onEnd;

    // Ref for current direction (to avoid stale closures in RAF)
    const directionRef = useRef<EasingDirection>(direction);
    directionRef.current = direction;

    // Control functions
    const start = useCallback(() => {
        if (state === "running") return;
        startTimeRef.current = null; // Will be set on next frame
        hasCompletedRef.current = false; // Reset completion flag
        setState("running");
    }, [state]);

    const stop = useCallback(() => {
        if (state === "idle") return;
        pausedRawProgressRef.current = currentRawProgressRef.current;
        setState("idle");
    }, [state]);

    const reset = useCallback(() => {
        setState("idle");
        setProgress(0);
        setDirection("forward");
        setEndCount(0);
        startTimeRef.current = null;
        pausedRawProgressRef.current = 0;
        currentRawProgressRef.current = 0;
        delayRemainingRef.current = delay;
        isFirstRunRef.current = true;
        hasCompletedRef.current = false;
        directionRef.current = "forward";
    }, [delay]);

    const restart = useCallback(() => {
        reset();
        // Use setTimeout to ensure reset completes before starting
        setTimeout(() => {
            setState("running");
        }, 0);
    }, [reset]);

    // RAF callback
    useRaf(() => {
        if (startTimeRef.current === null) {
            // When resuming, calculate start time based on paused raw progress
            // so animation continues from where it left off
            const resumeOffset = pausedRawProgressRef.current * duration;
            startTimeRef.current = performance.now() - resumeOffset;
        }

        const elapsed = performance.now() - startTimeRef.current;

        // Handle delay (only on first run)
        if (isFirstRunRef.current && delayRemainingRef.current > 0) {
            if (elapsed < delayRemainingRef.current) {
                return; // Still waiting for delay
            }
            // Delay complete, adjust start time
            startTimeRef.current = performance.now() - (elapsed - delayRemainingRef.current);
            delayRemainingRef.current = 0;
            isFirstRunRef.current = false;
        }

        // Calculate raw progress (0-1) based on elapsed time since delay ended
        const adjustedElapsed = performance.now() - startTimeRef.current;
        const rawProgress = Math.min(adjustedElapsed / duration, 1);
        currentRawProgressRef.current = rawProgress; // Track for resume

        // Apply direction
        const directionalProgress = directionRef.current === "forward"
            ? rawProgress
            : 1 - rawProgress;

        // Apply easing
        const easedProgress = easing(directionalProgress);
        setProgress(easedProgress);

        // Check if animation completed (and we haven't already processed this completion)
        if (rawProgress >= 1 && !hasCompletedRef.current) {
            hasCompletedRef.current = true;

            // Increment end count and fire callback
            setEndCount((prev) => prev + 1);
            onEndRef.current?.();

            if (loop) {
                // Reset for next iteration
                startTimeRef.current = performance.now();
                hasCompletedRef.current = false; // Allow next iteration to complete

                if (alternate) {
                    // Flip direction
                    const newDirection = directionRef.current === "forward" ? "backward" : "forward";
                    directionRef.current = newDirection;
                    setDirection(newDirection);
                }
            } else {
                // Animation complete, stop
                setState("idle");
            }
        }
    }, state === "running");

    // Handle autoStart on mount
    useEffect(() => {
        if (autoStart) {
            setState("running");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const controls = useMemo<EasingControls>(
        () => ({
            start,
            stop,
            reset,
            restart,
            state,
            direction,
            endCount,
        }),
        [start, stop, reset, restart, state, direction, endCount]
    );

    return [progress, controls];
}

export { useEasing, Easing };
export type {
    EasingFunction,
    EasingState,
    EasingDirection,
    UseEasingOptions,
    EasingControls,
};
