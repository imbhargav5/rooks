import { vi } from "vitest";
import React from "react";
import {
  render,
  cleanup,
  getByTestId,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react";

import { useCookieState } from "@/hooks/useCookieState";

// Helper to clear all cookies between tests
function clearAllCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

describe("useCookieState defined", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useCookieState).toBeDefined();
  });
});

describe("useCookieState basic", () => {
  let App = () => <div />;

  beforeEach(() => {
    clearAllCookies();
    App = () => {
      const [value, set, remove] = useCookieState("test-cookie", "hello");

      return (
        <div data-testid="container">
          <p data-testid="value">{String(value)}</p>
          <button
            data-testid="new-value"
            onClick={() => {
              set("new value");
            }}
            type="button"
          >
            Set to new value
          </button>
          <button data-testid="remove-value" onClick={remove} type="button">
            Remove the cookie
          </button>
        </div>
      );
    };
  });

  afterEach(() => {
    clearAllCookies();
    cleanup();
  });

  it("initializes with default value when no cookie exists", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("hello");
  });

  it("initializes from existing cookie value", () => {
    expect.hasAssertions();
    document.cookie = `test-cookie=${encodeURIComponent(JSON.stringify("pre-existing"))}; path=/`;
    const { result } = renderHook(() => useCookieState("test-cookie", "default"));
    expect(result.current[0]).toBe("pre-existing");
  });

  it("initializes correctly with a function initializer", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState("test-fn-init", () => "from-function")
    );
    expect(result.current[0]).toBe("from-function");
  });

  it("sets a new value", async () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const setButton = getByTestId(container as HTMLElement, "new-value");
    act(() => {
      fireEvent.click(setButton);
    });
    const valueElement = getByTestId(container as HTMLElement, "value");
    await waitFor(() => expect(valueElement.innerHTML).toBe("new value"));
  });

  it("removes the cookie value", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState("test-remove-cookie", "initial")
    );
    expect(result.current[0]).toBe("initial");
    act(() => {
      result.current[2]();
    });
    await waitFor(() => expect(result.current[0]).toBeUndefined());
  });

  it("set and remove functions are stable across re-renders", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(() =>
      useCookieState("test-stable", "value")
    );
    const setBefore = result.current[1];
    const removeBefore = result.current[2];
    rerender();
    expect(result.current[1]).toBe(setBefore);
    expect(result.current[2]).toBe(removeBefore);
  });

  it("set and remove functions are stable after a set call", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(() =>
      useCookieState("test-stable-set", "value")
    );
    const setBefore = result.current[1];
    const removeBefore = result.current[2];
    act(() => {
      setBefore("updated");
    });
    rerender();
    expect(result.current[1]).toBe(setBefore);
    expect(result.current[2]).toBe(removeBefore);
  });
});

describe("useCookieState cookie interactions", () => {
  beforeEach(() => {
    clearAllCookies();
  });

  afterEach(() => {
    clearAllCookies();
    vi.restoreAllMocks();
  });

  it("writes value to document.cookie on initialization", () => {
    expect.hasAssertions();
    renderHook(() => useCookieState("write-test", "hello"));
    expect(document.cookie).toContain("write-test");
  });

  it("writes updated value to document.cookie", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState("update-test", "initial")
    );
    act(() => {
      result.current[1]("updated");
    });
    await waitFor(() => expect(result.current[0]).toBe("updated"));
    expect(document.cookie).toContain(encodeURIComponent(JSON.stringify("updated")));
  });

  it("supports function setter form", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useCookieState("fn-setter", 5));
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    await waitFor(() => expect(result.current[0]).toBe(6));
  });

  it("handles object values via JSON serialization", async () => {
    expect.hasAssertions();
    const initial = { name: "Alice", age: 30 };
    const { result } = renderHook(() =>
      useCookieState("object-cookie", initial)
    );
    expect(result.current[0]).toEqual(initial);
    const updated = { name: "Bob", age: 25 };
    act(() => {
      result.current[1](updated);
    });
    await waitFor(() => expect(result.current[0]).toEqual(updated));
  });

  it("handles array values", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState<number[]>("array-cookie", [1, 2, 3])
    );
    expect(result.current[0]).toEqual([1, 2, 3]);
    act(() => {
      result.current[1]([4, 5, 6]);
    });
    await waitFor(() => expect(result.current[0]).toEqual([4, 5, 6]));
  });

  it("handles boolean values", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState("bool-cookie", false)
    );
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1](true);
    });
    await waitFor(() => expect(result.current[0]).toBe(true));
  });

  it("handles numeric values", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState("num-cookie", 42)
    );
    expect(result.current[0]).toBe(42);
    act(() => {
      result.current[1](100);
    });
    await waitFor(() => expect(result.current[0]).toBe(100));
  });

  it("reads existing numeric cookie on mount", () => {
    expect.hasAssertions();
    document.cookie = `num-init-cookie=${encodeURIComponent(JSON.stringify(99))}; path=/`;
    const { result } = renderHook(() =>
      useCookieState("num-init-cookie", 0)
    );
    expect(result.current[0]).toBe(99);
  });

  it("reads existing object cookie on mount", () => {
    expect.hasAssertions();
    const obj = { x: 1, y: 2 };
    document.cookie = `obj-init-cookie=${encodeURIComponent(JSON.stringify(obj))}; path=/`;
    const { result } = renderHook(() =>
      useCookieState("obj-init-cookie", {})
    );
    expect(result.current[0]).toEqual(obj);
  });
});

describe("useCookieState with cookie options", () => {
  beforeEach(() => {
    clearAllCookies();
    vi.spyOn(document, "cookie", "set").mockImplementation(() => {});
  });

  afterEach(() => {
    clearAllCookies();
    vi.restoreAllMocks();
  });

  it("includes expires in cookie string when expires is a number (days)", async () => {
    expect.hasAssertions();
    const cookieSetter = vi.spyOn(document, "cookie", "set");
    renderHook(() =>
      useCookieState("expires-num", "value", { expires: 7 })
    );
    await waitFor(() => {
      const calls = cookieSetter.mock.calls.map((c) => c[0]);
      const hasCookieWithExpires = calls.some(
        (c) => c.includes("expires-num") && c.includes("expires=")
      );
      expect(hasCookieWithExpires).toBe(true);
    });
  });

  it("includes expires in cookie string when expires is a Date", async () => {
    expect.hasAssertions();
    const cookieSetter = vi.spyOn(document, "cookie", "set");
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    renderHook(() =>
      useCookieState("expires-date", "value", { expires: futureDate })
    );
    await waitFor(() => {
      const calls = cookieSetter.mock.calls.map((c) => c[0]);
      const hasCookieWithExpires = calls.some(
        (c) =>
          c.includes("expires-date") &&
          c.includes(`expires=${futureDate.toUTCString()}`)
      );
      expect(hasCookieWithExpires).toBe(true);
    });
  });

  it("includes path in cookie string", async () => {
    expect.hasAssertions();
    const cookieSetter = vi.spyOn(document, "cookie", "set");
    renderHook(() =>
      useCookieState("path-cookie", "value", { path: "/app" })
    );
    await waitFor(() => {
      const calls = cookieSetter.mock.calls.map((c) => c[0]);
      const hasPath = calls.some(
        (c) => c.includes("path-cookie") && c.includes("path=/app")
      );
      expect(hasPath).toBe(true);
    });
  });

  it("includes domain in cookie string", async () => {
    expect.hasAssertions();
    const cookieSetter = vi.spyOn(document, "cookie", "set");
    renderHook(() =>
      useCookieState("domain-cookie", "value", { domain: "example.com" })
    );
    await waitFor(() => {
      const calls = cookieSetter.mock.calls.map((c) => c[0]);
      const hasDomain = calls.some(
        (c) => c.includes("domain-cookie") && c.includes("domain=example.com")
      );
      expect(hasDomain).toBe(true);
    });
  });

  it("includes Secure flag in cookie string", async () => {
    expect.hasAssertions();
    const cookieSetter = vi.spyOn(document, "cookie", "set");
    renderHook(() =>
      useCookieState("secure-cookie", "value", { secure: true })
    );
    await waitFor(() => {
      const calls = cookieSetter.mock.calls.map((c) => c[0]);
      const hasSecure = calls.some(
        (c) => c.includes("secure-cookie") && c.includes("Secure")
      );
      expect(hasSecure).toBe(true);
    });
  });

  it("includes SameSite in cookie string", async () => {
    expect.hasAssertions();
    const cookieSetter = vi.spyOn(document, "cookie", "set");
    renderHook(() =>
      useCookieState("samesite-cookie", "value", { sameSite: "Lax" })
    );
    await waitFor(() => {
      const calls = cookieSetter.mock.calls.map((c) => c[0]);
      const hasSameSite = calls.some(
        (c) => c.includes("samesite-cookie") && c.includes("SameSite=Lax")
      );
      expect(hasSameSite).toBe(true);
    });
  });

  it("includes SameSite=Strict in cookie string", async () => {
    expect.hasAssertions();
    const cookieSetter = vi.spyOn(document, "cookie", "set");
    renderHook(() =>
      useCookieState("samesite-strict", "value", { sameSite: "Strict" })
    );
    await waitFor(() => {
      const calls = cookieSetter.mock.calls.map((c) => c[0]);
      const hasStrict = calls.some(
        (c) => c.includes("samesite-strict") && c.includes("SameSite=Strict")
      );
      expect(hasStrict).toBe(true);
    });
  });

  it("uses all options together", async () => {
    expect.hasAssertions();
    const cookieSetter = vi.spyOn(document, "cookie", "set");
    renderHook(() =>
      useCookieState("full-options", "value", {
        expires: 30,
        path: "/",
        domain: "example.com",
        secure: true,
        sameSite: "None",
      })
    );
    await waitFor(() => {
      const calls = cookieSetter.mock.calls.map((c) => c[0]);
      const fullOptionsCookie = calls.find((c) => c.includes("full-options"));
      expect(fullOptionsCookie).toBeDefined();
      expect(fullOptionsCookie).toContain("expires=");
      expect(fullOptionsCookie).toContain("path=/");
      expect(fullOptionsCookie).toContain("domain=example.com");
      expect(fullOptionsCookie).toContain("Secure");
      expect(fullOptionsCookie).toContain("SameSite=None");
    });
  });
});

describe("useCookieState edge cases", () => {
  beforeEach(() => {
    clearAllCookies();
  });

  afterEach(() => {
    clearAllCookies();
    vi.restoreAllMocks();
  });

  it("handles undefined initial value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState<string | undefined>("undef-cookie")
    );
    expect(result.current[0]).toBeUndefined();
  });

  it("handles keys with special characters", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState("special key", "value")
    );
    expect(result.current[0]).toBe("value");
    act(() => {
      result.current[1]("updated");
    });
    await waitFor(() => expect(result.current[0]).toBe("updated"));
  });

  it("returns tuple with value, set, remove", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useCookieState("tuple-test", "hello"));
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(3);
    expect(typeof result.current[0]).toBe("string");
    expect(typeof result.current[1]).toBe("function");
    expect(typeof result.current[2]).toBe("function");
  });
});
