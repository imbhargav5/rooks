import { useEffect, useMemo, useState } from "react";

/**
 * useMediaMatch
 *
 * A react hook that signals whether or not a media query is matched.
 *
 * @param query The media query to signal on. Example, `"print"` will signal
 * `true` when previewing in print mode, and `false` otherwise.
 * @returns Whether or not the media query is currently matched.
 * @see https://rooks.vercel.app/docs/useMediaMatch
 */
function useMediaMatch(query: string): boolean {
  const isWindowDefined = typeof window !== "undefined" && window.matchMedia;
  const matchMedia = useMemo<MediaQueryList | undefined>(
    () => (isWindowDefined ? window.matchMedia(query) : undefined),
    [query, isWindowDefined]
  );
  const [matches, setMatches] = useState<boolean>(() =>
    (isWindowDefined && matchMedia ? matchMedia.matches : false)
  );

  useEffect(() => {
    if (!isWindowDefined || !matchMedia) {
      return;
    }

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
  }, [isWindowDefined, matchMedia]);

  if (isWindowDefined) {
    console.warn("useMediaMatch cannot function as window is undefined.");

    return false;
  }

  return matches;
}

export { useMediaMatch };
