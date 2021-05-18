import Cookies from 'js-cookie';
import { useCallback, useState } from 'react';

type UseCookieStateType = {
  value: string | null;
  updateCookie: (newValue: string) => void;
  deleteCookie: () => void;
} | null;

/**
 *
 * @param cookieName Name of the cookie
 * @returns {handler} A handler to interact with the cookie
 */
const useCookieState = (
  cookieName: string,
  cookieValue: string | null = null,
  options?: Cookies.CookieAttributes
): UseCookieStateType => {
  const [value, setValue] = useState<string | null>(() => {
    if (typeof window !== undefined) {
      return Cookies.get(cookieName, options) || cookieValue;
    }

    return null;
  });

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

  return { deleteCookie, updateCookie, value };
};

export { useCookieState };
