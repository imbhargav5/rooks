import { useState, useCallback, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";

/**
 * useRafState
 *
 * Like useState but batches updates via requestAnimationFrame to prevent layout
 * thrashing for high-frequency updates (e.g. mousemove, scroll handlers).
 * If setState is called multiple times before the next animation frame, only
 * the last value is applied. Cancels any pending rAF on unmount.
 * SSR-safe: falls back to synchronous setState when requestAnimationFrame is
 * not available.
 *
 * @param initialState - Initial state value or initializer function
 * @returns A tuple [state, setState] with identical API to React.useState
 * @see https://rooks.vercel.app/docs/hooks/useRafState
 * @example
 * const [position, setPosition] = useRafState({ x: 0, y: 0 });
 *
 * useEffect(() => {
 *   const handleMouseMove = (e: MouseEvent) => {
 *     setPosition({ x: e.clientX, y: e.clientY });
 *   };
 *   window.addEventListener("mousemove", handleMouseMove);
 *   return () => window.removeEventListener("mousemove", handleMouseMove);
 * }, [setPosition]);
 */
export function useRafState<T>(
  initialState: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialState);
  const rafIdRef = useRef<number | null>(null);
  // Wrap in an object so any value of T (including null/undefined) is unambiguous
  const pendingRef = useRef<{ action: SetStateAction<T> } | null>(null);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const rafSetState: Dispatch<SetStateAction<T>> = useCallback(
    (action: SetStateAction<T>) => {
      // SSR guard: requestAnimationFrame is not available on the server
      if (typeof requestAnimationFrame === "undefined") {
        setState(action);
        return;
      }

      // Always keep only the latest pending action
      pendingRef.current = { action };

      // If a frame is already scheduled, reuse it
      if (rafIdRef.current !== null) {
        return;
      }

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (pendingRef.current !== null) {
          setState(pendingRef.current.action);
          pendingRef.current = null;
        }
      });
    },
    []
  );

  return [state, rafSetState];
}
