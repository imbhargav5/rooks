import { useEffect, useMemo, useState } from 'react';

/**
 * useMediaMatch
 *
 * A react hook that signals whether or not a media query is matched.
 *
 * @param query The media query to signal on. Example, `"print"` will signal
 * `true` when previewing in print mode, and `false` otherwise.
 * @param warn Whether or not to log warning when used in node
 * @returns Whether or not the media query is currently matched.
 */
function useMediaMatch(query: string, warn?: boolean): boolean {
  if (typeof window === 'undefined') {
    if (warn) console.warn('useMediaMatch cannot function as window is undefined.');

    return false;
  }

  const matchMedia = useMemo<MediaQueryList>(() => window.matchMedia(query), [
    query,
  ]);
  const [matches, setMatches] = useState<boolean>(() => matchMedia.matches);

  useEffect(() => {
    setMatches(matchMedia.matches);
    const listener = (event_: MediaQueryListEventMap['change']) =>
      setMatches(event_.matches);
    matchMedia.addEventListener('change', listener);

    return () => matchMedia.removeEventListener('change', listener);
  }, [matchMedia]);

  return matches;
}

export { useMediaMatch };
