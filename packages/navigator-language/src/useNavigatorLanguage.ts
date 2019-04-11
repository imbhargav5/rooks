import { useState, useEffect } from "react";

/**
 * useNavigatorLanguage hook
 *
 * Returns the language of the navigator
 *
 * @return {string|null}
 */
export function useNavigatorLanguage(): string | null {
  const [language, setLanguage] = useState(null);
  useEffect(() => {
    setLanguage(navigator.language || navigator["userLanguage"]);
  }, []);
  return language;
}
