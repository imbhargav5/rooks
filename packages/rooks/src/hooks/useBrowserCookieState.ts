import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFreshRef } from "./useFreshRef";
import {
  getCookieValue,
  removeCookie,
  stringifyCookie,
  type CookieScopeOptions,
} from "@/utils/cookies";

export type JsonPrimitive = boolean | number | string | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export type EncodeFunction<S> = (value: S) => string;
export type DecodeFunction<S> = (value: string) => S;

export type UseBrowserCookieStateOptions<S> = CookieScopeOptions & {
  encode?: EncodeFunction<S>;
  decode?: DecodeFunction<S>;
};

export type UseBrowserCookieStateReturnValue<S> = [
  S,
  Dispatch<SetStateAction<S>>,
  () => void,
];

type BrowserCookieStateEvent = CustomEvent<{ source: symbol }>;

const BROWSER_COOKIE_STATE_ERROR_MESSAGE =
  "useBrowserCookieState can only be used in a browser environment where document is defined.";

function defaultEncode(value: JsonValue) {
  const encoded = JSON.stringify(value);
  if (typeof encoded !== "string") {
    throw new TypeError("Cookie state must be JSON serializable.");
  }
  return encoded;
}

function defaultDecode(value: string): JsonValue {
  return JSON.parse(value) as JsonValue;
}

function resolveInitialValue<S>(initialValue: S | (() => S)) {
  return typeof initialValue === "function"
    ? (initialValue as () => S)()
    : initialValue;
}

function assertBrowserCookieSupport() {
  if (typeof document === "undefined") {
    throw new Error(BROWSER_COOKIE_STATE_ERROR_MESSAGE);
  }
}

/**
 * useBrowserCookieState
 * @description Persists state in browser cookies with same-document sync helpers.
 * @see {@link https://rooks.vercel.app/docs/hooks/useBrowserCookieState}
 */
function useBrowserCookieState<S extends JsonValue>(
  key: string,
  initialValue: S | (() => S),
  options?: UseBrowserCookieStateOptions<S>
): UseBrowserCookieStateReturnValue<S>;
function useBrowserCookieState<S>(
  key: string,
  initialValue: S | (() => S),
  options: CookieScopeOptions & {
    encode: EncodeFunction<S>;
    decode: DecodeFunction<S>;
  }
): UseBrowserCookieStateReturnValue<S>;
function useBrowserCookieState<S>(
  key: string,
  initialValue: S | (() => S),
  options: UseBrowserCookieStateOptions<S> = {}
): UseBrowserCookieStateReturnValue<S> {
  assertBrowserCookieSupport();

  const encode =
    options.encode ?? (defaultEncode as unknown as EncodeFunction<S>);
  const decode =
    options.decode ?? (defaultDecode as unknown as DecodeFunction<S>);
  const encodeRef = useFreshRef(encode, true);
  const decodeRef = useFreshRef(decode, true);
  const initialValueRef = useFreshRef(initialValue, true);
  const customEventName = useMemo(() => `rooks-cookie-state:${key}`, [key]);
  const instanceIdRef = useRef(Symbol("rooks-cookie-state"));
  const expiresKey =
    options.expires instanceof Date
      ? options.expires.toISOString()
      : options.expires;
  const scopeOptions = useMemo<CookieScopeOptions>(
    () => ({
      path: options.path,
      domain: options.domain,
      expires: expiresKey,
      maxAge: options.maxAge,
      sameSite: options.sameSite,
      secure: options.secure,
      partitioned: options.partitioned,
    }),
    [
      expiresKey,
      options.domain,
      options.maxAge,
      options.partitioned,
      options.path,
      options.sameSite,
      options.secure,
    ]
  );

  const readValue = useCallback(() => {
    const cookieValue = getCookieValue(key);
    if (cookieValue === null) {
      return resolveInitialValue(initialValueRef.current);
    }

    try {
      return decodeRef.current(cookieValue);
    } catch {
      return resolveInitialValue(initialValueRef.current);
    }
  }, [decodeRef, initialValueRef, key]);

  const [value, setValue] = useState<S>(() => readValue());
  const valueRef = useRef(value);

  const commitValue = useCallback((nextValue: S) => {
    valueRef.current = nextValue;
    setValue(nextValue);
  }, []);

  const syncFromCookie = useCallback(() => {
    commitValue(readValue());
  }, [commitValue, readValue]);

  useEffect(() => {
    syncFromCookie();
  }, [customEventName, syncFromCookie]);

  useEffect(() => {
    const handleCustomEvent = (event: Event) => {
      const customEvent = event as BrowserCookieStateEvent;
      if (customEvent.detail?.source !== instanceIdRef.current) {
        syncFromCookie();
      }
    };

    const handleVisibilityOrFocus = () => {
      syncFromCookie();
    };

    document.addEventListener(customEventName, handleCustomEvent);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    return () => {
      document.removeEventListener(customEventName, handleCustomEvent);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
    };
  }, [customEventName, syncFromCookie]);

  const setCookieState = useCallback(
    (newValue: SetStateAction<S>) => {
      const resolvedValue =
        typeof newValue === "function"
          ? (newValue as (previousValue: S) => S)(valueRef.current)
          : newValue;

      document.cookie = stringifyCookie(
        key,
        encodeRef.current(resolvedValue),
        scopeOptions
      );

      syncFromCookie();

      document.dispatchEvent(
        new CustomEvent(customEventName, {
          detail: {
            source: instanceIdRef.current,
          },
        })
      );
    },
    [customEventName, encodeRef, key, scopeOptions, syncFromCookie]
  );

  const remove = useCallback(() => {
    removeCookie(key, scopeOptions);
    syncFromCookie();

    document.dispatchEvent(
      new CustomEvent(customEventName, {
        detail: {
          source: instanceIdRef.current,
        },
      })
    );
  }, [customEventName, key, scopeOptions, syncFromCookie]);

  return [value, setCookieState, remove];
}

export { BROWSER_COOKIE_STATE_ERROR_MESSAGE, useBrowserCookieState };
export type { CookieScopeOptions };
