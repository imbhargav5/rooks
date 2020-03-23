/**
 * useNavigatorLanguage hook
 *
 * Returns the language of the navigator
 *
 * @return {string|null}
 */
export function useNavigatorLanguage(): string | null {
  return navigator.language;
}
