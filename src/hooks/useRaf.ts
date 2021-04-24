import raf from 'raf';
import { useRef, useEffect } from 'react';

/**
 *
 * useRaf
 * Uses a polyfilled version of requestAnimationFrame
 *
 * @param {Function} callback The callback function to be executed
 * @param {boolean} [isActive=true] The value which while true, keeps the raf running infinitely
 */
export function useRaf(
  callback: (timeElapsed: number) => void,
  isActive: boolean
): void {
  const savedCallback = useRef<(timeElapsed: number) => void>();
  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let animationFrame;
    let startTime;

    function tick() {
      const timeElapsed = Date.now() - startTime;
      startTime = Date.now();
      loop();
      savedCallback.current && savedCallback.current(timeElapsed);
    }

    function loop() {
      animationFrame = raf(tick);
    }

    if (isActive) {
      startTime = Date.now();
      loop();

      return () => {
        raf.cancel(animationFrame);
      };
    }
  }, [isActive]);
}
