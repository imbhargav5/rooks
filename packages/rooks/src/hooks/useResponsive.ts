import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";

export type ResponsiveMatches<TBreakpoint extends string> = Record<
  TBreakpoint,
  boolean
>;

export type UseResponsiveOptions<TBreakpoint extends string> = {
  defaultValue?: TBreakpoint | null;
};

export type UseResponsiveReturnValue<TBreakpoint extends string> = {
  current: TBreakpoint | null;
  matches: ResponsiveMatches<TBreakpoint>;
  isSupported: boolean;
};

function getEmptyMatches<TBreakpoint extends string>(
  queries: Record<TBreakpoint, string>
) {
  return Object.keys(queries).reduce((accumulator, key) => {
    accumulator[key as TBreakpoint] = false;
    return accumulator;
  }, {} as ResponsiveMatches<TBreakpoint>);
}

/**
 * useResponsive
 * @description Tracks a group of media queries and returns the current matching breakpoint.
 * @see {@link https://rooks.vercel.app/docs/hooks/useResponsive}
 */
function useResponsive<TBreakpoint extends string>(
  queries: Record<TBreakpoint, string>,
  options: UseResponsiveOptions<TBreakpoint> = {}
): UseResponsiveReturnValue<TBreakpoint> {
  const querySignature = JSON.stringify(Object.entries(queries));
  const entries = useMemo(
    () => JSON.parse(querySignature) as Array<[TBreakpoint, string]>,
    [querySignature]
  );
  const snapshotRef = useRef<UseResponsiveReturnValue<TBreakpoint> | null>(
    null
  );
  const isSupported =
    typeof window !== "undefined" && typeof window.matchMedia === "function";
  const defaultValue = options.defaultValue ?? null;
  const emptyMatches = useMemo(
    () =>
      getEmptyMatches(
        Object.fromEntries(entries) as Record<TBreakpoint, string>
      ),
    [entries]
  );
  const mediaQueryLists = useMemo(
    () =>
      isSupported ? entries.map(([, query]) => window.matchMedia(query)) : [],
    [entries, isSupported]
  );
  const unsupportedSnapshot = useMemo<UseResponsiveReturnValue<TBreakpoint>>(
    () => ({
      current: defaultValue,
      matches: emptyMatches,
      isSupported: false,
    }),
    [defaultValue, emptyMatches]
  );
  const serverSnapshot = useMemo<UseResponsiveReturnValue<TBreakpoint>>(
    () => ({
      current: defaultValue,
      matches: emptyMatches,
      isSupported: false,
    }),
    [defaultValue, emptyMatches]
  );

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!isSupported) {
        return () => {};
      }

      for (const mediaQueryList of mediaQueryLists) {
        if (typeof mediaQueryList.addEventListener === "function") {
          mediaQueryList.addEventListener("change", onStoreChange);
        } else {
          mediaQueryList.addListener(onStoreChange);
        }
      }

      return () => {
        for (const mediaQueryList of mediaQueryLists) {
          if (typeof mediaQueryList.removeEventListener === "function") {
            mediaQueryList.removeEventListener("change", onStoreChange);
          } else {
            mediaQueryList.removeListener(onStoreChange);
          }
        }
      };
    },
    [isSupported, mediaQueryLists]
  );

  const getSnapshot = useCallback(() => {
    if (!isSupported) {
      snapshotRef.current = unsupportedSnapshot;
      return unsupportedSnapshot;
    }

    const matches = entries.reduce((accumulator, [key], index) => {
      accumulator[key] = mediaQueryLists[index]?.matches ?? false;
      return accumulator;
    }, {} as ResponsiveMatches<TBreakpoint>);

    const current = entries.reduce<TBreakpoint | null>((result, [key]) => {
      if (matches[key]) {
        return key;
      }

      return result;
    }, defaultValue);

    const previousSnapshot = snapshotRef.current;
    if (
      previousSnapshot &&
      previousSnapshot.isSupported &&
      previousSnapshot.current === current &&
      Object.keys(previousSnapshot.matches).length === entries.length &&
      entries.every(([key]) => previousSnapshot.matches[key] === matches[key])
    ) {
      return previousSnapshot;
    }

    const nextSnapshot = {
      current,
      matches,
      isSupported: true,
    };
    snapshotRef.current = nextSnapshot;
    return nextSnapshot;
  }, [
    defaultValue,
    entries,
    isSupported,
    mediaQueryLists,
    unsupportedSnapshot,
  ]);

  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return snapshot;
}

export { useResponsive };
