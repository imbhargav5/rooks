import { useCallback, useRef, useSyncExternalStore } from "react";

/**
 * Responsive breakpoint names ordered from smallest to largest.
 * - xs: < 576px
 * - sm: >= 576px
 * - md: >= 768px
 * - lg: >= 992px
 * - xl: >= 1200px
 * - xxl: >= 1400px
 */
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/**
 * @typedef ResponsiveState
 * @type {object}
 * @property {Breakpoint} breakpoint The current active breakpoint name
 * @property {boolean} isXs Whether the current breakpoint is xs (width < 576px)
 * @property {boolean} isSm Whether the current breakpoint is sm (576px <= width < 768px)
 * @property {boolean} isMd Whether the current breakpoint is md (768px <= width < 992px)
 * @property {boolean} isLg Whether the current breakpoint is lg (992px <= width < 1200px)
 * @property {boolean} isXl Whether the current breakpoint is xl (1200px <= width < 1400px)
 * @property {boolean} isXxl Whether the current breakpoint is xxl (width >= 1400px)
 * @property {number} width The current window inner width in pixels
 */
type ResponsiveState = {
  breakpoint: Breakpoint;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isXxl: boolean;
  width: number;
};

/**
 * Standard responsive breakpoint thresholds in pixels.
 * Based on widely-used conventions (e.g. Bootstrap, Tailwind).
 */
const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.xxl) return "xxl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
}

function buildResponsiveState(width: number): ResponsiveState {
  const breakpoint = getBreakpoint(width);
  return {
    breakpoint,
    isXs: breakpoint === "xs",
    isSm: breakpoint === "sm",
    isMd: breakpoint === "md",
    isLg: breakpoint === "lg",
    isXl: breakpoint === "xl",
    isXxl: breakpoint === "xxl",
    width,
  };
}

const serverSnapshot: ResponsiveState = buildResponsiveState(0);

/**
 * useResponsive hook
 *
 * Returns current responsive breakpoint information based on the window's inner width.
 * Uses standard breakpoints:
 * - xs: < 576px
 * - sm: >= 576px
 * - md: >= 768px
 * - lg: >= 992px
 * - xl: >= 1200px
 * - xxl: >= 1400px
 *
 * @returns {ResponsiveState} Breakpoint state including the active breakpoint name, boolean flags for each breakpoint, and the current window width
 * @see https://rooks.vercel.app/docs/hooks/useResponsive
 */
function useResponsive(): ResponsiveState {
  const cacheRef = useRef<ResponsiveState>(serverSnapshot);

  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener("resize", onStoreChange);
    return () => {
      window.removeEventListener("resize", onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    const width = window.innerWidth;
    const newState = buildResponsiveState(width);
    const current = cacheRef.current;
    // Only update cache when the breakpoint or width changes to preserve referential equality
    if (
      current.breakpoint !== newState.breakpoint ||
      current.width !== newState.width
    ) {
      cacheRef.current = newState;
    }
    return cacheRef.current;
  }, []);

  const getServerSnapshot = useCallback(() => {
    return serverSnapshot;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export { useResponsive };
export type { Breakpoint, ResponsiveState };
