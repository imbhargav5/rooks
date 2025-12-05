import { vi } from "vitest";
/**
 */
import { renderHook, act } from "@testing-library/react";
import { usePreferredColorScheme } from "@/hooks/usePreferredColorScheme";

describe("usePreferredColorScheme", () => {
  let mockMatchMedia: vi.Mock;
  let darkModeQuery: any;
  let lightModeQuery: any;
  let consoleWarnSpy: vi.SpyInstance;

  beforeEach(() => {
    darkModeQuery = {
      matches: false,
      media: "(prefers-color-scheme: dark)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    lightModeQuery = {
      matches: true,
      media: "(prefers-color-scheme: light)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockMatchMedia = vi.fn((query: string) => {
      if (query === "(prefers-color-scheme: dark)") {
        return darkModeQuery;
      }
      if (query === "(prefers-color-scheme: light)") {
        return lightModeQuery;
      }
      return { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    });

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    });

    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(usePreferredColorScheme).toBeDefined();
  });

  it("should detect light color scheme", () => {
    expect.hasAssertions();
    lightModeQuery.matches = true;
    darkModeQuery.matches = false;

    const { result } = renderHook(() => usePreferredColorScheme());

    expect(result.current.colorScheme).toBe("light");
    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);
  });

  it("should detect dark color scheme", () => {
    expect.hasAssertions();
    lightModeQuery.matches = false;
    darkModeQuery.matches = true;

    const { result } = renderHook(() => usePreferredColorScheme());

    expect(result.current.colorScheme).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(result.current.isLight).toBe(false);
  });

  it("should detect no-preference", () => {
    expect.hasAssertions();
    lightModeQuery.matches = false;
    darkModeQuery.matches = false;

    const { result } = renderHook(() => usePreferredColorScheme());

    expect(result.current.colorScheme).toBe("no-preference");
    expect(result.current.isDark).toBe(false);
    expect(result.current.isLight).toBe(false);
  });

  it("should update when color scheme changes", () => {
    expect.hasAssertions();
    lightModeQuery.matches = true;
    darkModeQuery.matches = false;

    const { result } = renderHook(() => usePreferredColorScheme());

    expect(result.current.colorScheme).toBe("light");

    // Simulate change to dark mode
    act(() => {
      lightModeQuery.matches = false;
      darkModeQuery.matches = true;
      const darkListener = darkModeQuery.addEventListener.mock.calls.find(
        ([event]: any) => event === "change"
      )?.[1];
      if (darkListener) {
        darkListener();
      }
    });

    expect(result.current.colorScheme).toBe("dark");
    expect(result.current.isDark).toBe(true);
  });

  it("should register event listeners on mount", () => {
    expect.hasAssertions();
    renderHook(() => usePreferredColorScheme());

    expect(darkModeQuery.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
    expect(lightModeQuery.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should remove event listeners on unmount", () => {
    expect.hasAssertions();
    const { unmount } = renderHook(() => usePreferredColorScheme());

    unmount();

    expect(darkModeQuery.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
    expect(lightModeQuery.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should handle browsers with addListener fallback", () => {
    expect.hasAssertions();
    delete darkModeQuery.addEventListener;
    delete lightModeQuery.addEventListener;
    darkModeQuery.addListener = vi.fn();
    lightModeQuery.addListener = vi.fn();
    darkModeQuery.removeListener = vi.fn();
    lightModeQuery.removeListener = vi.fn();

    const { unmount } = renderHook(() => usePreferredColorScheme());

    expect(darkModeQuery.addListener).toHaveBeenCalledWith(expect.any(Function));
    expect(lightModeQuery.addListener).toHaveBeenCalledWith(expect.any(Function));

    unmount();

    expect(darkModeQuery.removeListener).toHaveBeenCalledWith(expect.any(Function));
    expect(lightModeQuery.removeListener).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should toggle between light and dark modes", () => {
    expect.hasAssertions();
    lightModeQuery.matches = true;
    darkModeQuery.matches = false;

    const { result } = renderHook(() => usePreferredColorScheme());

    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);

    // Change to dark
    act(() => {
      lightModeQuery.matches = false;
      darkModeQuery.matches = true;
      const darkListener = darkModeQuery.addEventListener.mock.calls.find(
        ([event]: any) => event === "change"
      )?.[1];
      if (darkListener) {
        darkListener();
      }
    });

    expect(result.current.isLight).toBe(false);
    expect(result.current.isDark).toBe(true);

    // Change back to light
    act(() => {
      lightModeQuery.matches = true;
      darkModeQuery.matches = false;
      const lightListener = lightModeQuery.addEventListener.mock.calls.find(
        ([event]: any) => event === "change"
      )?.[1];
      if (lightListener) {
        lightListener();
      }
    });

    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);
  });
});
