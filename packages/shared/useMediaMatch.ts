import { useEffect, useState } from 'react';

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
  if (typeof window === 'undefined') {
    console.warn('useMediaMatch cannot function as window is undefined.');
    return false;
  }

  const [matchMedia, setMatchMedia] = useState(() => window.matchMedia(query));
  const [matches, setMatches] = useState(() => matchMedia.matches);

  useEffect(() => {
    const mm = window.matchMedia(query);
    setMatchMedia(mm);
    setMatches(mm.matches);
  }, [query]);

  useEffect(() => {
    const listener = (ev: MediaQueryListEventMap['change']) =>
      setMatches(ev.matches);
    matchMedia.addEventListener('change', listener);
    return () => matchMedia.removeEventListener('change', listener);
  }, [matchMedia]);

  return matches;
}

export { useMediaMatch };
