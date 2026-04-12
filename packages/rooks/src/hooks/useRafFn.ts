import raf from "raf";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Params passed to the useRafFn callback on each animation frame
 */
interface UseRafFnCallbackParams {
  /** The DOMHighResTimeStamp provided by requestAnimationFrame */
  timestamp: DOMHighResTimeStamp;
  /** Milliseconds elapsed since the loop was last started or resumed */
  elapsed: number;
}

/**
 * Options for useRafFn
 */
interface UseRafFnOptions {
  /** Whether to start the loop immediately on mount. Default: false */
  immediate?: boolean;
}

/**
 * Controls returned by useRafFn
 */
interface UseRafFnControls {
  /** Start or resume the requestAnimationFrame loop */
  resume: () => void;
  /** Pause the requestAnimationFrame loop */
  pause: () => void;
}

/**
 * useRafFn
 * Runs a callback in a requestAnimationFrame loop with pause/resume controls.
 *
 * @param {Function} fn The callback to invoke on each animation frame. Receives `{ timestamp, elapsed }`.
 * @param {UseRafFnOptions} [options] Configuration options
 * @param {boolean} [options.immediate=false] Whether to start the loop immediately on mount
 * @returns {[boolean, UseRafFnControls]} Tuple of [isActive, { resume, pause }]
 * @see https://rooks.vercel.app/docs/hooks/useRafFn
 *
 * @example
 * ```tsx
 * const [isActive, { resume, pause }] = useRafFn(({ elapsed }) => {
 *   console.log(`Elapsed: ${elapsed}ms`);
 * }, { immediate: true });
 * ```
 */
export function useRafFn(
  fn: (params: UseRafFnCallbackParams) => void,
  options: UseRafFnOptions = {}
): [boolean, UseRafFnControls] {
  const { immediate = false } = options;

  const [isActive, setIsActive] = useState<boolean>(false);

  // Keep latest callback in a ref to avoid stale closures in the RAF loop
  const fnRef = useRef<(params: UseRafFnCallbackParams) => void>(fn);
  fnRef.current = fn;

  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  // Mirror isActive in a ref so the loop callback can read it synchronously
  const isActiveRef = useRef<boolean>(false);

  const loop = useCallback((timestamp: DOMHighResTimeStamp) => {
    if (!isActiveRef.current) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    fnRef.current({ timestamp, elapsed });

    rafIdRef.current = raf(loop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resume = useCallback(() => {
    if (typeof window === "undefined") return;
    if (isActiveRef.current) return;
    isActiveRef.current = true;
    startTimeRef.current = null;
    setIsActive(true);
    rafIdRef.current = raf(loop);
  }, [loop]);

  const pause = useCallback(() => {
    if (!isActiveRef.current) return;
    if (rafIdRef.current !== null) {
      raf.cancel(rafIdRef.current);
      rafIdRef.current = null;
    }
    isActiveRef.current = false;
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      resume();
    }

    return () => {
      if (rafIdRef.current !== null) {
        raf.cancel(rafIdRef.current);
        rafIdRef.current = null;
      }
      isActiveRef.current = false;
    };
    // Only run on mount/unmount; resume is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const controls = useMemo<UseRafFnControls>(
    () => ({ resume, pause }),
    [resume, pause]
  );

  return [isActive, controls];
}

export type { UseRafFnCallbackParams, UseRafFnOptions, UseRafFnControls };
