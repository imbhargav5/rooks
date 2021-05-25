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
 * @param converter
 * @returns
 */
const useCookieState = (
  key: string,
  defaultValue: any = '',
  options: Cookies.CookieAttributes = {},
  converter: {} = {}
): CookieHandler => {
  const getValueFromCookie = useCallback(() => {
    if (typeof window === 'undefined') {
      return 'null';
    }

    // Note: Don't pass options while reading the cookie bcz
    // Cookies.get('foo', { domain: 'sub.example.com' }) // `domain` won't have any effect...! and so on
    const valueInCookie = Cookies.get(key);

    if (valueInCookie) {
      // the try/catch is here in case the cookie value was set before
      try {
        return valueInCookie;
      } catch {
        Cookies.remove(key, options);
      }
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  }, [defaultValue, key, options]);

  const [value, setValue] = useState(getValueFromCookie());

  const listen = (function () {
    let lastCookies = document.cookie
      .split(';')
      .map((x) => x.trim().split(/(=)/))
      .reduce((a, b) => {
        a[b[0]] = a[b[0]]
          ? `${a[b[0]]}, ` + b.slice(2).join('')
          : b.slice(2).join('');

        return a;
      }, {});

    return function () {
      const currentCookies = document.cookie
        .split(';')
        .map((x) => {
          return x.trim().split(/(=)/);
        })
        .reduce((a, b) => {
          a[b[0]] = a[b[0]]
            ? `${a[b[0]]}, ` + b.slice(2).join('')
            : b.slice(2).join('');

          return a;
        }, {});

      for (const cookie in currentCookies) {
        if (
          currentCookies[cookie] !== lastCookies[cookie] &&
          currentCookies[cookie] !== null
        ) {
          setValue(currentCookies[cookie]);
        }
      }
      lastCookies = currentCookies;
    };
  })();
  // check for changes across windows
  useEffect(() => {
    (window as any).cookieStore.addEventListener('change', listen);

    return () => {
      (window as any).cookieStore.removeEventListener('change', listen);
    };
  }, [listen]);

  const saveValueToCookie = useCallback(
    (valueToSet) => {
      if (typeof window === 'undefined') {
        return null;
      }

      return Cookies.set(key, valueToSet);
    },
    [key]
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
    if (valueLoadedFromCookie) set(valueLoadedFromCookie);
    else if (
      valueLoadedFromCookie === null ||
      valueLoadedFromCookie === 'null'
    ) {
      set(defaultValue);
    }
  }, [defaultValue, getValueFromCookie, set]);

  // eslint-disable-next-line consistent-return
  function remove() {
    if (typeof window === 'undefined') {
      return false;
    }
    Cookies.remove(key, options);
  }

  // initialize
  useEffect(() => {
    init();
  }, [init]);

  Cookies.withConverter(converter);

  const handler = Object.assign([value, set, remove], {
    remove,
    set,
    value,
  });

  return handler as CookieHandler;
};

export { useCookieState };
