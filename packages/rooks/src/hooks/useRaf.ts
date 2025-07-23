import raf from "raf";
import { useRef, useEffect } from "react";
import { noop } from "@/utils/noop";

/**
 *
 * useRaf
 * Uses a polyfilled version of requestAnimationFrame
 *
 * @param {Function} callback The callback function to be executed
 * @param {boolean} [isActive] The value which while true, keeps the raf running infinitely
 * @see https://rooks.vercel.app/docs/hooks/useRaf
 */
export function useRaf(
  callback: (timeElapsed: number) => void,
  isActive: boolean
): void {
  const savedCallback = useRef<(timeElapsed: number) => void>(null);
  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let animationFrame: number | undefined;
    let startTime: number = Date.now();

    function tick() {
      const timeElapsed = Date.now() - startTime;
      startTime = Date.now();
      loop();
      savedCallback.current?.(timeElapsed);
    }

    function loop() {
      animationFrame = raf(tick);
    }

    if (isActive) {
      startTime = Date.now();
      loop();

      return () => {
        if (animationFrame) {
          raf.cancel(animationFrame);
        }
      };
    } else {
      return noop;
    }
  }, [isActive]);
}
