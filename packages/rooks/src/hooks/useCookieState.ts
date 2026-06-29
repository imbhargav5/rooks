import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect, useCallback } from "react";
import { useFreshRef } from "./useFreshRef";

type SameSite = "Strict" | "Lax" | "None";

interface CookieOptions {
  /**
   * Number of days until the cookie expires, or a specific Date object.
   * If not set, creates a session cookie.
   */
  expires?: number | Date;
  /** Path for the cookie. Defaults to '/' */
  path?: string;
  /** Domain for the cookie */
  domain?: string;
  /** Whether the cookie is only sent over HTTPS */
  secure?: boolean;
  /** SameSite policy for the cookie */
  sameSite?: SameSite;
}

function serializeCookieValue(value: unknown): string {
  return encodeURIComponent(JSON.stringify(value));
}

function serializeCookie(
  name: string,
  value: unknown,
  options: CookieOptions = {}
): string {
  const { expires, path = "/", domain, secure, sameSite } = options;

  let cookieString = `${encodeURIComponent(name)}=${serializeCookieValue(value)}`;

  if (expires !== undefined) {
    let expiresDate: Date;
    if (typeof expires === "number") {
      expiresDate = new Date();
      expiresDate.setTime(expiresDate.getTime() + expires * 24 * 60 * 60 * 1000);
    } else {
      expiresDate = expires;
    }
    cookieString += `; expires=${expiresDate.toUTCString()}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += "; Secure";
  }

  if (sameSite) {
    cookieString += `; SameSite=${sameSite}`;
  }

  return cookieString;
}

function getCookieValue<S>(name: string): S | null {
  if (typeof document === "undefined") {
    return null;
  }

  const encodedName = encodeURIComponent(name);
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const cookieName = trimmed.substring(0, eqIndex);
    if (cookieName === encodedName) {
      const cookieValue = trimmed.substring(eqIndex + 1);
      try {
        return JSON.parse(decodeURIComponent(cookieValue)) as S;
      } catch {
        return decodeURIComponent(cookieValue) as unknown as S;
      }
    }
  }

  return null;
}

function removeCookie(
  name: string,
  options: Pick<CookieOptions, "path" | "domain"> = {}
): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = serializeCookie(name, "", {
    ...options,
    expires: new Date(0),
  });
}

type UseCookieStateReturnValue<S> = [S, Dispatch<SetStateAction<S>>, () => void];

/**
 * useCookieState hook
 * Manages browser cookie state with a useState-like API
 *
 * @param {string} key - Name of the cookie
 * @param {any} initialState - Default initial value
 * @param {CookieOptions} options - Cookie options (expires, path, domain, secure, sameSite)
 * @see https://rooks.vercel.app/docs/hooks/useCookieState
 */
function useCookieState<S>(
  key: string,
  initialState?: S | (() => S),
  options: CookieOptions = {}
): UseCookieStateReturnValue<S> {
  const [value, setValue] = useState<S>(() => {
    const valueFromCookie = getCookieValue<S>(key);
    if (valueFromCookie !== null) {
      return valueFromCookie;
    }
    return typeof initialState === "function"
      ? (initialState as () => S)()
      : (initialState as S);
  });

  const optionsRef = useFreshRef(options);
  const currentValue = useFreshRef(value, true);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    if (value === undefined) {
      removeCookie(key, {
        path: optionsRef.current.path,
        domain: optionsRef.current.domain,
      });
    } else {
      document.cookie = serializeCookie(key, value, optionsRef.current);
    }
  }, [key, value, optionsRef]);

  const set = useCallback(
    (newValue: SetStateAction<S>) => {
      const resolvedNewValue =
        typeof newValue === "function"
          ? (newValue as (prevState: S) => S)(currentValue.current)
          : newValue;
      setValue(resolvedNewValue);
    },
    [currentValue]
  );

  const remove = useCallback(() => {
    removeCookie(key, {
      path: optionsRef.current.path,
      domain: optionsRef.current.domain,
    });
    setValue(undefined as unknown as S);
  }, [key, optionsRef]);

  return [value, set, remove];
}

export { useCookieState };
export type { CookieOptions };
