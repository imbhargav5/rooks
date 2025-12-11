import { useCallback, useSyncExternalStore } from "react";

/**
 * useMediaMatch
 *
 * A react hook that signals whether or not a media query is matched.
 *
 * @param query The media query to signal on. Example, `"print"` will signal
 * `true` when previewing in print mode, and `false` otherwise.
 * @param defaultServerRenderedValue Optional value to return when window is undefined (server-side rendering). Defaults to false.
 * @returns Whether or not the media query is currently matched.
 * @see https://rooks.vercel.app/docs/hooks/useMediaMatch
 */
function useMediaMatch(
  query: string,
  defaultServerRenderedValue: boolean = false
): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(
    () => defaultServerRenderedValue,
    [defaultServerRenderedValue]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export { useMediaMatch };
