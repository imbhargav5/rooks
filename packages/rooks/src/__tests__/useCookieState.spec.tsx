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

// ─── helpers ─────────────────────────────────────────────────────────────────

function clearAllCookies() {
  document.cookie.split("; ").forEach((c) => {
    const name = c.split("=")[0];
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
  });
}

function setCookieRaw(name: string, value: unknown) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    JSON.stringify(value)
  )}; path=/`;
}

// ─── suites ──────────────────────────────────────────────────────────────────

describe("useCookieState defined", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useCookieState).toBeDefined();
  });
});

describe("useCookieState basic", () => {
  afterEach(() => {
    clearAllCookies();
    cleanup();
  });

  it("initializes with default value when cookie does not exist", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState("cookie-init", { defaultValue: "hello" })
    );
    expect(result.current[0]).toBe("hello");
  });

  it("initializes with function default value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState("cookie-fn", { defaultValue: () => "fn-default" })
    );
    expect(result.current[0]).toBe("fn-default");
  });

  it("reads existing cookie value on mount (prefers cookie over default)", () => {
    expect.hasAssertions();
    setCookieRaw("cookie-existing", "stored-value");
    const { result } = renderHook(() =>
      useCookieState("cookie-existing", { defaultValue: "fallback" })
    );
    expect(result.current[0]).toBe("stored-value");
  });

  it("reads existing numeric cookie value", () => {
    expect.hasAssertions();
    setCookieRaw("cookie-num", 42);
    const { result } = renderHook(() =>
      useCookieState<number>("cookie-num", { defaultValue: 0 })
    );
    expect(result.current[0]).toBe(42);
  });

  it("reads existing object cookie value", () => {
    expect.hasAssertions();
    setCookieRaw("cookie-obj", { foo: "bar" });
    const { result } = renderHook(() =>
      useCookieState<{ foo: string }>("cookie-obj")
    );
    expect(result.current[0]).toEqual({ foo: "bar" });
  });

  it("sets a new value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState("cookie-set", { defaultValue: "initial" })
    );
    act(() => {
      result.current[1]("updated");
    });
    expect(result.current[0]).toBe("updated");
  });

  it("sets a new value with an updater function", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useCookieState<number>("cookie-updater", { defaultValue: 5 })
    );
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(6);
  });

  it("setter is stable across re-renders (memo)", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(() =>
      useCookieState("cookie-memo", { defaultValue: "value" })
    );

    const setterBefore = result.current[1];
    rerender();
    const setterAfterRerender = result.current[1];
    expect(setterBefore).toBe(setterAfterRerender);

    act(() => {
      setterBefore("new-value");
    });
    const setterAfterSet = result.current[1];
    expect(setterBefore).toBe(setterAfterSet);
  });
});

describe("useCookieState document.cookie writes", () => {
  afterEach(() => {
    clearAllCookies();
    vi.restoreAllMocks();
  });

  it("writes value to document.cookie on init", () => {
    expect.hasAssertions();

    renderHook(() =>
      useCookieState("cookie-write", { defaultValue: "init-value" })
    );

    // After renderHook (which wraps in act), the useEffect should have run
    expect(document.cookie).toContain("cookie-write");
  });

  it("writes new value to document.cookie when setValue is called", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useCookieState("cookie-write2", { defaultValue: "old" })
    );

    act(() => {
      result.current[1]("new");
    });

    expect(result.current[0]).toBe("new");
    // Verify the new value was persisted to the cookie jar
    expect(document.cookie).toContain("cookie-write2");
    // Read the cookie back and verify the value
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith("cookie-write2="));
    expect(raw).toBeDefined();
    expect(decodeURIComponent(raw!.split("=")[1])).toBe(JSON.stringify("new"));
  });

  it("includes path attribute in cookie string", () => {
    expect.hasAssertions();
    const writtenStrings: string[] = [];
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "cookie"
    )!;
    vi.spyOn(Document.prototype, "cookie", "set").mockImplementation(function (
      this: Document,
      val: string
    ) {
      writtenStrings.push(val);
      originalDescriptor.set!.call(this, val);
    });

    renderHook(() =>
      useCookieState("cookie-path", { defaultValue: "v", path: "/admin" })
    );

    expect(writtenStrings.some((s) => s.includes("path=/admin"))).toBe(true);
  });
});

describe("useCookieState React component integration", () => {
  afterEach(() => {
    clearAllCookies();
    cleanup();
  });

  it("renders with default value and updates on click", async () => {
    expect.hasAssertions();

    const App = () => {
      const [theme, setTheme] = useCookieState("app-theme", {
        defaultValue: "light",
      });
      return (
        <div data-testid="container">
          <p data-testid="value">{theme}</p>
          <button
            data-testid="toggle"
            onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
            type="button"
          >
            Toggle
          </button>
        </div>
      );
    };

    const { container } = render(<App />);
    expect(getByTestId(container as HTMLElement, "value").textContent).toBe(
      "light"
    );

    act(() => {
      fireEvent.click(getByTestId(container as HTMLElement, "toggle"));
    });

    await waitFor(() =>
      expect(
        getByTestId(container as HTMLElement, "value").textContent
      ).toBe("dark")
    );
  });
});

describe("useCookieState within-document sync", () => {
  afterEach(() => {
    clearAllCookies();
    cleanup();
  });

  it("syncs value across two hook instances in the same document", () => {
    expect.hasAssertions();

    const { result: a } = renderHook(() =>
      useCookieState("cookie-sync", { defaultValue: "first" })
    );
    const { result: b } = renderHook(() =>
      useCookieState("cookie-sync", { defaultValue: "first" })
    );

    act(() => {
      a.current[1]("updated");
    });

    // Both instances should reflect the new value
    expect(a.current[0]).toBe("updated");
    expect(b.current[0]).toBe("updated");
  });
});
