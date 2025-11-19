import { useState, useEffect, useRef } from "react";
import { useRaf } from "./useRaf";

/**
 * Easing function type
 */
type EasingFunction = (t: number) => number;

/**
 * Common easing functions
 */
const Easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};

/**
 * useTween hook
 *
 * @param duration Duration of the tween in milliseconds
 * @param easing Easing function to use
 * @returns The current value of the tween (0 to 1)
 * @see https://rooks.vercel.app/docs/hooks/useTween
 */
function useTween(
  duration: number = 200,
  easing: EasingFunction = Easing.linear
): number {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const raf = useRaf(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }

    const elapsed = performance.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);

    setValue(easedProgress);

    if (progress < 1) {
      return true; // Continue animation
    }
    return false; // Stop animation
  }, true);

  useEffect(() => {
      // Reset start time when duration or easing changes to restart animation if needed
      // However, typically useTween is used once or controlled. 
      // For simplicity in this version, we just let it run on mount.
      // If we want to restart, we might need a trigger.
      // But based on standard useTween implementations, it often runs on mount.
      startTimeRef.current = null;
  }, [duration, easing]);

  return value;
}

export { useTween, Easing };
