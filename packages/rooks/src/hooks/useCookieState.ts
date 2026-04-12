import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFreshRef } from "./useFreshRef";

// ─── helpers ────────────────────────────────────────────────────────────────

function readCookieValue<T>(name: string): T | null {
  if (typeof document === "undefined") {
    return null;
  }
  const entries = document.cookie.split("; ");
  for (const entry of entries) {
    const eqIdx = entry.indexOf("=");
    if (eqIdx === -1) continue;
    if (decodeURIComponent(entry.slice(0, eqIdx)) === name) {
      const raw = decodeURIComponent(entry.slice(eqIdx + 1));
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    }
  }
  return null;
}

function writeCookieValue<T>(
  name: string,
  value: T,
  options: Omit<UseCookieStateOptions<T>, "defaultValue">
): void {
  if (typeof document === "undefined") {
    return;
  }
  const { expires, path = "/", domain, secure, sameSite } = options;

  let str = `${encodeURIComponent(name)}=${encodeURIComponent(
    JSON.stringify(value)
  )}`;

  if (expires !== undefined) {
    const d =
      typeof expires === "number"
        ? new Date(Date.now() + expires * 864e5) // days → ms
        : expires;
    str += `; expires=${d.toUTCString()}`;
  }

  str += `; path=${path}`;
  if (domain) str += `; domain=${domain}`;
  if (secure) str += "; secure";
  if (sameSite) str += `; samesite=${sameSite}`;

  document.cookie = str;
}

function resolveInitialValue<T>(
  cookieName: string,
  defaultValue: T | (() => T) | undefined
): T {
  const cookieValue = readCookieValue<T>(cookieName);
  if (cookieValue !== null) {
    return cookieValue;
  }
  if (typeof defaultValue === "function") {
    return (defaultValue as () => T)();
  }
  return defaultValue as T;
}

// ─── types ───────────────────────────────────────────────────────────────────

/**
 * Cookie attribute options for useCookieState.
 */
type UseCookieStateOptions<T> = {
  /**
   * Initial value when the cookie does not exist yet.
   * Accepts a plain value or a zero-argument factory function.
   */
  defaultValue?: T | (() => T);
  /**
   * Expiry expressed as a number of days from now, or an explicit `Date`.
   * Omit to create a session cookie.
   */
  expires?: number | Date;
  /** Cookie `path` attribute. Defaults to `"/"`. */
  path?: string;
  /** Cookie `domain` attribute. */
  domain?: string;
  /** Whether to set the `Secure` attribute. */
  secure?: boolean;
  /** `SameSite` cookie attribute. */
  sameSite?: "strict" | "lax" | "none";
};

type UseCookieStateReturnValue<T> = [T, Dispatch<SetStateAction<T>>];

type BroadcastMessage<T> = { newValue: T };

// ─── hook ────────────────────────────────────────────────────────────────────

/**
 * useCookieState
 * @description Cookie-backed state with a useState-like API. Values are
 * JSON-serialised and deserialised automatically. The hook is SSR-safe — on
 * the server it returns the default value and a no-op setter. Changes are
 * synced across same-origin tabs via the BroadcastChannel API (when
 * available) and across multiple instances within the same document via a
 * custom event.
 *
 * @param {string} cookieName - Name of the cookie to read from and write to
 * @param {UseCookieStateOptions<T>} options - Cookie attributes and default value
 * @returns {UseCookieStateReturnValue<T>} Tuple of [cookieValue, setCookieValue]
 * @see https://rooks.vercel.app/docs/hooks/useCookieState
 *
 * @example
 *
 * const [theme, setTheme] = useCookieState("app-theme", {
 *   defaultValue: "light",
 *   expires: 30,
 *   path: "/",
 * });
 *
 * // Set a new value directly
 * setTheme("dark");
 *
 * // Set via updater function (receives previous value)
 * setTheme((prev) => (prev === "dark" ? "light" : "dark"));
 */
function useCookieState<T>(
  cookieName: string,
  options: UseCookieStateOptions<T> = {}
): UseCookieStateReturnValue<T> {
  const { defaultValue, ...cookieOptions } = options;

  const [value, setValue] = useState<T>(() =>
    resolveInitialValue<T>(cookieName, defaultValue)
  );

  const isUpdateFromBroadcast = useRef(false);
  const isUpdateFromWithinDocumentListener = useRef(false);

  // Keep a fresh reference to the current value so the `set` callback
  // does not need to include `value` in its dependency array.
  const currentValueRef = useFreshRef(value, true);

  // Keep a fresh reference to cookie options so they are always current
  // inside effects without adding the options object to dependencies.
  const cookieOptionsRef = useFreshRef(cookieOptions);

  const customEventTypeName = useMemo(
    () => `rooks-${cookieName}-cookie-update`,
    [cookieName]
  );

  // Persist the current value to the cookie whenever it changes, unless the
  // change originated from a cross-tab or within-document listener (those
  // paths already have the cookie written or are reading from the cookie).
  useEffect(() => {
    if (
      !isUpdateFromBroadcast.current &&
      !isUpdateFromWithinDocumentListener.current
    ) {
      writeCookieValue(cookieName, value, cookieOptionsRef.current);
    }
    isUpdateFromBroadcast.current = false;
    isUpdateFromWithinDocumentListener.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieName, value]);

  // ── within-document listener (same tab, multiple hook instances) ──────────
  const listenToCustomEventWithinDocument = useCallback(
    (event: CustomEvent<BroadcastMessage<T>>) => {
      try {
        isUpdateFromWithinDocumentListener.current = true;
        const { newValue } = event.detail;
        if (value !== newValue) {
          setValue(newValue);
        }
      } catch {
        // ignore malformed events
      }
    },
    [value]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener(
        customEventTypeName,
        listenToCustomEventWithinDocument as EventListener
      );
      return () => {
        document.removeEventListener(
          customEventTypeName,
          listenToCustomEventWithinDocument as EventListener
        );
      };
    } else {
      console.warn("[useCookieState] document is undefined.");
      return () => {};
    }
  }, [customEventTypeName, listenToCustomEventWithinDocument]);

  const broadcastValueWithinDocument = useCallback(
    (newValue: T) => {
      if (typeof document !== "undefined") {
        const event = new CustomEvent<BroadcastMessage<T>>(customEventTypeName, {
          detail: { newValue },
        });
        document.dispatchEvent(event);
      }
    },
    [customEventTypeName]
  );

  // ── cross-tab listener (BroadcastChannel) ────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return () => {};
    }

    const channel = new BroadcastChannel(`rooks-cookie-${cookieName}`);

    channel.onmessage = (event: MessageEvent<BroadcastMessage<T>>) => {
      try {
        isUpdateFromBroadcast.current = true;
        const { newValue } = event.data;
        if (value !== newValue) {
          setValue(newValue);
        }
      } catch {
        // ignore malformed messages
      }
    };

    return () => {
      channel.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieName, value]);

  // ── public setter ─────────────────────────────────────────────────────────
  const set = useCallback(
    (newValue: SetStateAction<T>) => {
      const resolved =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(currentValueRef.current)
          : newValue;

      isUpdateFromBroadcast.current = false;
      isUpdateFromWithinDocumentListener.current = false;

      // Write the cookie synchronously so callers see the update immediately
      // (broadcastValueWithinDocument fires synchronously and would otherwise
      // set isUpdateFromWithinDocumentListener before the effect runs).
      writeCookieValue(cookieName, resolved, cookieOptionsRef.current);

      setValue(resolved);
      broadcastValueWithinDocument(resolved);

      // Notify other tabs
      if (
        typeof window !== "undefined" &&
        typeof BroadcastChannel !== "undefined"
      ) {
        const channel = new BroadcastChannel(`rooks-cookie-${cookieName}`);
        channel.postMessage({ newValue: resolved } satisfies BroadcastMessage<T>);
        channel.close();
      }
    },
    [broadcastValueWithinDocument, cookieName, cookieOptionsRef, currentValueRef]
  );

  return [value, set];
}

export { useCookieState };
export type { UseCookieStateOptions, UseCookieStateReturnValue };
