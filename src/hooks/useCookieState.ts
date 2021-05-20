import Cookies from 'js-cookie';
import { useCallback, useState, useEffect } from 'react';

type CookieHandlerAsObject = {
  value: any;
  set: (newValue: any) => void;
  remove: () => void;
};

type CookieHandlerAsArray = [any, (newValue: any) => void, () => void];

type CookieHandler = CookieHandlerAsArray & CookieHandlerAsObject;

/**
 * useCookieState hook
 * React hook that returns the current value of a cookie, a callback to update the cookie and a callback to delete the cookie.
 *
 * @param key
 * @param defaultValue
 * @param options
 * @param param3
 * @returns
 */
const useCookieState = (
  key: string,
  defaultValue: any = null,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {},
  options: Cookies.CookieAttributes = {}
): CookieHandler => {
  const getValueFromCookie = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    // Note: Don't pass options while reading the cookie bcz
    // Cookies.get('foo', { domain: 'sub.example.com' }) // `domain` won't have any effect...! and so on
    const valueInCookie = Cookies.get(key);
    if (valueInCookie) {
      // the try/catch is here in case the cookie value was set before
      try {
        return deserialize(valueInCookie);
      } catch {
        Cookies.remove(key, options);
      }
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  }, [defaultValue, deserialize, key, options]);

  const [value, setValue] = useState(getValueFromCookie());

  const saveValueToCookie = useCallback(
    (valueToSet) => {
      if (typeof window === 'undefined') {
        return null;
      }

      return Cookies.set(key, serialize(valueToSet));
    },
    [key, serialize]
  );

  const set = useCallback(
    (newValue) => {
      setValue(newValue);
      saveValueToCookie(newValue);
    },
    [saveValueToCookie]
  );

  const init = useCallback(() => {
    const valueLoadedFromCookie = getValueFromCookie();
    if (valueLoadedFromCookie === null || valueLoadedFromCookie === 'null') {
      set(defaultValue);
    }
  }, [defaultValue, getValueFromCookie, set]);

  // eslint-disable-next-line consistent-return
  function remove() {
    set(null);
    if (typeof window === 'undefined') {
      return false;
    }
    Cookies.remove(key, options);
  }

  // initialize
  useEffect(() => {
    init();
  }, [init]);

  const handler = Object.assign([value, set, remove], {
    remove,
    set,
    value,
  });

  return handler as CookieHandler;
};

export { useCookieState };
