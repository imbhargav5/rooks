import Cookies from 'js-cookie';
import { useCallback, useState } from 'react';

/**
 *
 * @param cookieName Name of the cookie
 * @returns {handler} A handler to interact with the cookie
 */
const useCookieState = (
  cookieName: string,
  options?: Cookies.CookieAttributes
): [string | null, (newValue: string) => void, () => void] | null => {
  const [value, setValue] = useState<string | null>(
    () => Cookies.get(cookieName, options) || null
  );

  const updateCookie = useCallback(
    (newValue: string) => {
      Cookies.set(cookieName, newValue, options);
      setValue(newValue);
    },
    [cookieName, options]
  );

  const deleteCookie = useCallback(() => {
    Cookies.remove(cookieName);
    setValue(null);
  }, [cookieName]);

  if (!window) return null;

  return [value, updateCookie, deleteCookie];
};

export { useCookieState };
