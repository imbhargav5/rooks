import { useState } from 'react';
import { useWindowEventListener } from './useWindowEventListener';

type Language = string | null;

function getLanguage(): Language {
  // eslint-disable-next-line no-negated-condition
  if (typeof navigator !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return navigator.language || navigator['userLanguage'];
  } else {
    return null;
  }
}

/**
 * useNavigatorLanguage hook
 * Returns the language of the navigator
 *
 * @returns {Language}
 */
export function useNavigatorLanguage(): Language {
  const [language, setLanguage] = useState<Language>(getLanguage);

  useWindowEventListener('languagechange', () => {
    setLanguage(getLanguage);
  });

  return language;
}
