import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useBrowserCookieState } from "@/hooks/useBrowserCookieState";
import type { JsonValue } from "@/hooks/useBrowserCookieState";

type ValueCase = {
  initial: JsonValue;
  key: string;
  label: string;
  next: JsonValue;
};

const valueCases: ValueCase[] = [
  {
    label: "string",
    key: "cookie-string",
    initial: "light",
    next: "dark",
  },
  {
    label: "number",
    key: "cookie-number",
    initial: 1,
    next: 2,
  },
  {
    label: "boolean",
    key: "cookie-boolean",
    initial: false,
    next: true,
  },
  {
    label: "object",
    key: "cookie-object",
    initial: { theme: "light" },
    next: { theme: "dark" },
  },
  {
    label: "array",
    key: "cookie-array",
    initial: ["light"],
    next: ["dark"],
  },
];

function writeCookie(name: string, value: string) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/`;
}

function clearCookie(name: string) {
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/`;
}

function readCookie(name: string) {
  const encodedName = `${encodeURIComponent(name)}=`;
  const segments = document.cookie ? document.cookie.split("; ") : [];
  for (const segment of segments) {
    if (segment.startsWith(encodedName)) {
      return decodeURIComponent(segment.slice(encodedName.length));
    }
  }

  return null;
}

function encodedValue(value: unknown) {
  return JSON.stringify(value);
}

describe("useBrowserCookieState matrix", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    for (const valueCase of valueCases) {
      clearCookie(valueCase.key);
      clearCookie(`${valueCase.key}-a`);
      clearCookie(`${valueCase.key}-b`);
      clearCookie(`${valueCase.key}-external`);
    }
  });

  it.each(valueCases)(
    "uses the fallback initial value when no cookie exists for $label",
    ({ initial, key }) => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      expect(result.current[0]).toEqual(initial);
    }
  );

  it.each(valueCases)(
    "reads an existing cookie on mount for $label",
    ({ key, next }) => {
      expect.hasAssertions();
      writeCookie(key, encodedValue(next));

      const { result } = renderHook(() =>
        useBrowserCookieState(key, null, { path: "/" })
      );

      expect(result.current[0]).toEqual(next);
    }
  );

  it.each(valueCases)(
    "writes state changes to cookies for $label",
    ({ initial, key, next }) => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      act(() => {
        result.current[1](next);
      });

      expect(result.current[0]).toEqual(next);
      expect(readCookie(key)).toBe(encodedValue(next));
    }
  );

  it.each(valueCases)(
    "supports updater functions for $label",
    ({ initial, key, next }) => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      act(() => {
        result.current[1](() => next);
      });

      expect(result.current[0]).toEqual(next);
      expect(readCookie(key)).toBe(encodedValue(next));
    }
  );

  it.each(valueCases)(
    "remove resets to the initial value for $label",
    ({ initial, key, next }) => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      act(() => {
        result.current[1](next);
      });
      expect(result.current[0]).toEqual(next);

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toEqual(initial);
      expect(readCookie(key)).toBeNull();
    }
  );

  it.each(valueCases)(
    "same-document direct writes sync peer hooks for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      const firstHook = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );
      const secondHook = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      act(() => {
        firstHook.result.current[1](next);
      });

      await waitFor(() => {
        expect(secondHook.result.current[0]).toEqual(next);
      });
    }
  );

  it.each(valueCases)(
    "same-document updater writes sync peer hooks for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      const firstHook = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );
      const secondHook = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      act(() => {
        firstHook.result.current[1](() => next);
      });

      await waitFor(() => {
        expect(secondHook.result.current[0]).toEqual(next);
      });
    }
  );

  it.each(valueCases)(
    "focus re-reads external cookie changes for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      writeCookie(key, encodedValue(next));

      act(() => {
        window.dispatchEvent(new Event("focus"));
      });

      await waitFor(() => {
        expect(result.current[0]).toEqual(next);
      });
    }
  );

  it.each(valueCases)(
    "visibilitychange re-reads external cookie changes for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      writeCookie(key, encodedValue(next));

      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });

      await waitFor(() => {
        expect(result.current[0]).toEqual(next);
      });
    }
  );

  it.each(valueCases)(
    "switching keys re-reads the cookie source for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      writeCookie(`${key}-a`, encodedValue(initial));
      writeCookie(`${key}-b`, encodedValue(next));

      const { result, rerender } = renderHook(
        ({ activeKey }) =>
          useBrowserCookieState(activeKey, null, { path: "/" }),
        {
          initialProps: {
            activeKey: `${key}-a`,
          },
        }
      );

      expect(result.current[0]).toEqual(initial);

      rerender({ activeKey: `${key}-b` });

      await waitFor(() => {
        expect(result.current[0]).toEqual(next);
      });
    }
  );

  it.each(valueCases)(
    "custom encode/decode works for direct writes for $label",
    ({ initial, key, next, label }) => {
      expect.hasAssertions();
      const encode = (value: unknown) => `${label}:${JSON.stringify(value)}`;
      const decode = (value: string) =>
        JSON.parse(value.slice(label.length + 1));
      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, {
          path: "/",
          encode,
          decode,
        })
      );

      act(() => {
        result.current[1](next);
      });

      expect(result.current[0]).toEqual(next);
      expect(readCookie(key)).toBe(encode(next));
    }
  );

  it.each(valueCases)(
    "custom decode applies during external focus sync for $label",
    async ({ initial, key, next, label }) => {
      expect.hasAssertions();
      const encode = (value: unknown) => `${label}:${JSON.stringify(value)}`;
      const decode = (value: string) =>
        JSON.parse(value.slice(label.length + 1));
      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, {
          path: "/",
          encode,
          decode,
        })
      );

      writeCookie(key, encode(next));

      act(() => {
        window.dispatchEvent(new Event("focus"));
      });

      await waitFor(() => {
        expect(result.current[0]).toEqual(next);
      });
    }
  );

  it.each(valueCases)(
    "preserves the typed initial value when JSON parsing fails for $label",
    ({ initial, key }) => {
      expect.hasAssertions();
      writeCookie(key, "not-json");

      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      expect(result.current[0]).toEqual(initial);
    }
  );

  it.each(valueCases)(
    "focus resets to the initial value after external deletion for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      writeCookie(key, encodedValue(next));
      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      await waitFor(() => {
        expect(result.current[0]).toEqual(next);
      });

      clearCookie(key);

      act(() => {
        window.dispatchEvent(new Event("focus"));
      });

      await waitFor(() => {
        expect(result.current[0]).toEqual(initial);
      });
    }
  );

  it.each(valueCases)(
    "visibilitychange resets to the initial value after external deletion for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      writeCookie(key, encodedValue(next));
      const { result } = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      await waitFor(() => {
        expect(result.current[0]).toEqual(next);
      });

      clearCookie(key);

      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });

      await waitFor(() => {
        expect(result.current[0]).toEqual(initial);
      });
    }
  );

  it.each(valueCases)(
    "same-document events do not leak across different keys for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      const firstHook = renderHook(() =>
        useBrowserCookieState(`${key}-a`, initial, { path: "/" })
      );
      const secondHook = renderHook(() =>
        useBrowserCookieState(`${key}-b`, initial, { path: "/" })
      );

      act(() => {
        firstHook.result.current[1](next);
      });

      await waitFor(() => {
        expect(firstHook.result.current[0]).toEqual(next);
      });
      expect(secondHook.result.current[0]).toEqual(initial);
    }
  );

  it.each(valueCases)(
    "external cookie changes to other keys do not affect the active hook for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useBrowserCookieState(`${key}-a`, initial, { path: "/" })
      );

      writeCookie(`${key}-b`, encodedValue(next));

      act(() => {
        window.dispatchEvent(new Event("focus"));
      });

      await waitFor(() => {
        expect(result.current[0]).toEqual(initial);
      });
    }
  );

  it.each(valueCases)(
    "remove synchronizes peer hooks for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      const firstHook = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );
      const secondHook = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      act(() => {
        firstHook.result.current[1](next);
      });

      await waitFor(() => {
        expect(secondHook.result.current[0]).toEqual(next);
      });

      act(() => {
        firstHook.result.current[2]();
      });

      await waitFor(() => {
        expect(secondHook.result.current[0]).toEqual(initial);
      });
    }
  );

  it.each(valueCases)(
    "remove then set again re-synchronizes peer hooks for $label",
    async ({ initial, key, next }) => {
      expect.hasAssertions();
      const firstHook = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );
      const secondHook = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      act(() => {
        firstHook.result.current[2]();
      });

      await waitFor(() => {
        expect(secondHook.result.current[0]).toEqual(initial);
      });

      act(() => {
        firstHook.result.current[1](next);
      });

      await waitFor(() => {
        expect(firstHook.result.current[0]).toEqual(next);
        expect(secondHook.result.current[0]).toEqual(next);
      });
    }
  );

  it.each(valueCases)(
    "JSON values round-trip after remount for $label",
    ({ initial, key, next }) => {
      expect.hasAssertions();
      const firstHook = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );

      act(() => {
        firstHook.result.current[1](next);
      });
      expect(firstHook.result.current[0]).toEqual(next);

      firstHook.unmount();

      const secondHook = renderHook(() =>
        useBrowserCookieState(key, initial, { path: "/" })
      );
      expect(secondHook.result.current[0]).toEqual(next);
    }
  );
});
