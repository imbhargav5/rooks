import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";

/**
 * Default Bootstrap-compatible breakpoints (in pixels).
 * Defined outside the hook so the reference is always stable when no custom
 * breakpoints are supplied.
 */
const DEFAULT_BREAKPOINTS: Record<string, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

function buildFalseState(
  breakpoints: Record<string, number>
): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const name of Object.keys(breakpoints)) {
    state[name] = false;
  }
  return state;
}

/**
 * useResponsive
 *
 * Responsive breakpoint detection hook. Returns a record whose keys are
 * breakpoint names and whose values are `true` when the viewport is at least
 * as wide as that breakpoint's minimum width. All values are `false` during
 * SSR. The returned object is referentially stable — it only changes when at
 * least one boolean value changes.
 *
 * Uses `window.matchMedia` so that changes fire immediately without polling.
 *
 * @param breakpoints Optional map of breakpoint names to minimum widths in
 * pixels. Defaults to Bootstrap-compatible breakpoints:
 * `xs` (0), `sm` (576), `md` (768), `lg` (992), `xl` (1200), `xxl` (1600).
 * Pass a **stable / memoized** object to avoid unnecessary re-subscriptions
 * on every render.
 * @returns A `Record<string, boolean>` mapping each breakpoint name to
 * whether the current viewport width is ≥ that breakpoint's minimum width.
 * @example
 * ```tsx
 * import { useResponsive } from "rooks";
 *
 * function App() {
 *   const { sm, md, lg } = useResponsive();
 *
 *   return (
 *     <div>
 *       {lg && <Sidebar />}
 *       <main style={{ width: md ? "70%" : "100%" }}>
 *         {sm ? <FullNav /> : <HamburgerMenu />}
 *       </main>
 *     </div>
 *   );
 * }
 * ```
 * @example
 * ```tsx
 * import { useMemo } from "react";
 * import { useResponsive } from "rooks";
 *
 * function App() {
 *   const breakpoints = useMemo(() => ({ mobile: 0, tablet: 768, desktop: 1280 }), []);
 *   const { mobile, tablet, desktop } = useResponsive(breakpoints);
 *
 *   return <p>desktop: {String(desktop)}, tablet: {String(tablet)}</p>;
 * }
 * ```
 * @see https://rooks.vercel.app/docs/hooks/useResponsive
 */
export function useResponsive(
  breakpoints: Record<string, number> = DEFAULT_BREAKPOINTS
): Record<string, boolean> {
  // Cache the last snapshot to preserve referential equality across renders
  // when nothing has changed.
  const cacheRef = useRef<Record<string, boolean>>(buildFalseState(breakpoints));

  // Stable SSR / server snapshot — all breakpoints map to false.
  const serverState = useMemo(
    () => buildFalseState(breakpoints),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [breakpoints]
  );

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const cleanup: Array<() => void> = [];
      for (const minWidth of Object.values(breakpoints)) {
        const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
        mql.addEventListener("change", onStoreChange);
        cleanup.push(() => mql.removeEventListener("change", onStoreChange));
      }
      return () => {
        for (const fn of cleanup) {
          fn();
        }
      };
    },
    [breakpoints]
  );

  const getSnapshot = useCallback(() => {
    let changed = false;
    const newState: Record<string, boolean> = {};

    for (const [name, minWidth] of Object.entries(breakpoints)) {
      const matches = window.matchMedia(`(min-width: ${minWidth}px)`).matches;
      newState[name] = matches;
      if (cacheRef.current[name] !== matches) {
        changed = true;
      }
    }

    // Also treat key-set changes as a change (e.g. breakpoints object updated)
    if (
      !changed &&
      Object.keys(cacheRef.current).length === Object.keys(breakpoints).length
    ) {
      return cacheRef.current;
    }

    cacheRef.current = newState;
    return cacheRef.current;
  }, [breakpoints]);

  const getServerSnapshot = useCallback(
    () => serverState,
    [serverState]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
