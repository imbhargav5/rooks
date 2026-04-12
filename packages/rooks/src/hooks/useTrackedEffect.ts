import { useEffect, useRef } from "react";

/**
 * Information about a single dependency that changed between renders.
 */
type DepChange = {
  /** Zero-based position of this dependency in the deps array */
  index: number;
  /** Value of this dependency on the previous render (undefined on first run) */
  previousValue: unknown;
  /** Value of this dependency on the current render */
  currentValue: unknown;
};

/**
 * Callback signature for useTrackedEffect.
 *
 * @param changes      Every dependency that changed since the last run, in
 *                     index order. On the initial mount every dependency is
 *                     included because there is no prior run to compare with.
 * @param previousDeps Full snapshot of the dependency array from the previous
 *                     run. Empty array on the initial mount.
 * @param currentDeps  Full snapshot of the dependency array for the current run.
 */
type TrackedEffectCallback = (
  changes: Array<DepChange>,
  previousDeps: readonly unknown[],
  currentDeps: readonly unknown[]
) => void | (() => void);

/**
 * useTrackedEffect hook
 *
 * @description Like useEffect, but the callback receives information about
 * exactly which dependencies changed between renders — their index, previous
 * value, and current value. Useful for debugging effects, writing conditional
 * logic inside an effect, or understanding why an effect re-runs.
 *
 * SSR behaviour mirrors useEffect: the callback is not invoked on the server.
 *
 * @param {TrackedEffectCallback} effect Callback that receives change info,
 *   previousDeps, and currentDeps. May return an optional cleanup function
 *   just like a normal useEffect callback.
 * @param {readonly unknown[]} deps The dependency array — same semantics as
 *   the second argument of useEffect.
 * @returns {void}
 * @see https://rooks.vercel.app/docs/hooks/useTrackedEffect
 *
 * @example
 *
 * // Log which dependency triggered the effect
 * useTrackedEffect(
 *   (changes, previousDeps, currentDeps) => {
 *     changes.forEach(({ index, previousValue, currentValue }) => {
 *       console.log(`dep[${index}] changed:`, previousValue, "→", currentValue);
 *     });
 *   },
 *   [userId, filter]
 * );
 *
 * @example
 *
 * // Conditionally fetch only when a specific dep changes
 * useTrackedEffect(
 *   (changes) => {
 *     const userChanged = changes.some((c) => c.index === 0);
 *     if (userChanged) {
 *       fetchUserData(userId);
 *     }
 *   },
 *   [userId, pageSize]
 * );
 *
 */
function useTrackedEffect(
  effect: TrackedEffectCallback,
  deps: readonly unknown[]
): void {
  const previousDepsRef = useRef<readonly unknown[] | undefined>(undefined);

  useEffect(() => {
    const previousDeps = previousDepsRef.current;
    const currentDeps = deps;

    const changes = currentDeps.reduce<Array<DepChange>>((acc, dep, index) => {
      if (previousDeps === undefined || !Object.is(dep, previousDeps[index])) {
        acc.push({
          index,
          previousValue:
            previousDeps !== undefined ? previousDeps[index] : undefined,
          currentValue: dep,
        });
      }
      return acc;
    }, []);

    previousDepsRef.current = currentDeps;

    const cleanup = effect(changes, previousDeps ?? [], currentDeps);
    if (typeof cleanup === "function") {
      return cleanup;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps as unknown[]);
}

export { useTrackedEffect };
export type { DepChange, TrackedEffectCallback };
