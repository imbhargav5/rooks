import { useEffect, useMemo, useState } from "react";

/**
 * useMediaMatch
 *
 * A react hook that signals whether or not a media query is matched.
 *
 * @param query The media query to signal on. Example, `"print"` will signal
 * `true` when previewing in print mode, and `false` otherwise.
 * @returns Whether or not the media query is currently matched.
 */
function useMediaMatch(query: string): boolean {
  const matchMedia = useMemo<MediaQueryList>(
    () => window.matchMedia(query),
    [query]
  );
  const [matches, setMatches] = useState<boolean>(() => matchMedia.matches);

  useEffect(() => {
    setMatches(matchMedia.matches);
    const listener = (event: MediaQueryListEventMap["change"]) =>
      setMatches(event.matches);
    matchMedia.addEventListener("change", listener);
    return () => matchMedia.removeEventListener("change", listener);
  }, [matchMedia]);

  if (typeof window === "undefined") {
    console.warn("useMediaMatch cannot function as window is undefined.");

    return false;
  }

  return matches;
}

export { useMediaMatch };
