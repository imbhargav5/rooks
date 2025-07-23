import { useSyncExternalStore } from "react";

type Language = string | null;

function getLanguageSnapshot(): Language {

  if (typeof navigator !== "undefined") {

    return navigator.language;
  } else {
    return null;
  }
}

function getLanguageSubscription(callback: () => void) {
  // subscription function is only called on the client side
  if (typeof window !== "undefined") {
    window.addEventListener("languagechange", callback);
    return () => {
      window.removeEventListener("languagechange", callback);
    };
  }
  // unreachable
  return () => { };
}

function getLanguageServerSnapshot(): Language {
  return null;
}

/**
 * useNavigatorLanguage hook
 * Returns the language of the navigator
 *
 * @returns {Language}
 * @see https://rooks.vercel.app/docs/hooks/useNavigatorLanguage
 */
export function useNavigatorLanguage(): Language {
  return useSyncExternalStore(getLanguageSubscription, getLanguageSnapshot, getLanguageServerSnapshot);
}
