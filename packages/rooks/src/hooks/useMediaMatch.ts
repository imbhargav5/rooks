import { useEffect, useMemo, useState } from "react";

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
function useMediaMatch(query: string, defaultServerRenderedValue: boolean = false): boolean {
  if (typeof window === "undefined") {
    console.warn("useMediaMatch cannot function as window is undefined.");

    return defaultServerRenderedValue;
  }

  const matchMedia = useMemo<MediaQueryList>(
    () => window.matchMedia(query),
    [query]
  );
  const [matches, setMatches] = useState<boolean>(() => matchMedia.matches);

  useEffect(() => {
    setMatches(matchMedia.matches);
    const listener = (event: MediaQueryListEventMap["change"]) =>
      setMatches(event.matches);

    if (matchMedia.addEventListener) {
      matchMedia.addEventListener("change", listener);
      return () => matchMedia.removeEventListener("change", listener);
    } else {
      matchMedia.addListener(listener);
      return () => matchMedia.removeListener(listener);
    }
  }, [matchMedia]);

  return matches;
}

export { useMediaMatch };
