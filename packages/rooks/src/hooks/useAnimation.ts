import { useState, useEffect, useRef } from "react";
import { useRaf } from "./useRaf";

/**
 * Easing function type
 */
type EasingFunction = (t: number) => number;

/**
 * Animation options
 */
interface AnimationOptions {
    duration: number;
    easing?: EasingFunction;
    delay?: number;
    loop?: boolean;
}

/**
 * useAnimation hook
 *
 * @param options Animation options
 * @returns The current value of the animation (0 to 1)
 * @see https://rooks.vercel.app/docs/hooks/useAnimation
 */
function useAnimation(options: AnimationOptions): number {
    const { duration, easing = (t) => t, delay = 0, loop = false } = options;
    const [value, setValue] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const delayRef = useRef(delay);

    useRaf(() => {
        if (startTimeRef.current === null) {
            startTimeRef.current = performance.now();
        }

        const elapsed = performance.now() - startTimeRef.current;

        if (elapsed < delayRef.current) {
            return true; // Waiting for delay
        }

        const timeSinceStart = elapsed - delayRef.current;
        const progress = Math.min(timeSinceStart / duration, 1);
        const easedProgress = easing(progress);

        setValue(easedProgress);

        if (progress < 1) {
            return true; // Continue animation
        }

        if (loop) {
            startTimeRef.current = performance.now();
            delayRef.current = 0; // No delay for subsequent loops
            return true; // Restart animation
        }

        return false; // Stop animation
    }, true);

    useEffect(() => {
        startTimeRef.current = null;
        delayRef.current = delay;
    }, [duration, easing, delay, loop]);

    return value;
}

export { useAnimation };
