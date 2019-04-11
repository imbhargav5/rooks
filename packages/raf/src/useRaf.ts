import { useState, useRef, useLayoutEffect } from "react";
import raf from "raf";

/*
  We are using raf which is a polyfilled version of requestAnimationFrame
*/
/**
 *
 * useRaf
 * @param {function} callback The callback function to be executed
 * @param {boolean} [isActive=true] The value which while true, keeps the raf running infinitely
 */
export function useRaf(
  callback: (timeElapsed: number) => void,
  isActive: boolean
): void {
  const savedCallback = useRef<(timeElapsed: number) => void>();
  // Remember the latest function.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useLayoutEffect(() => {
    let startTime, animationFrame;

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
