import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { useResponsive } from "@/hooks/useResponsive";

const { act } = TestRenderer;

// ---------------------------------------------------------------------------
// matchMedia mock helpers
// ---------------------------------------------------------------------------

interface MockMQLEntry {
  matches: boolean;
  listeners: Set<() => void>;
}

const mockStore = new Map<string, MockMQLEntry>();

function setupMatchMedia() {
  mockStore.clear();

  // jsdom does not implement window.matchMedia — assign it directly
  // (same approach used in useMediaMatch.spec.tsx)
  window.matchMedia = vi.fn((query: string) => {
    if (!mockStore.has(query)) {
      mockStore.set(query, { matches: false, listeners: new Set() });
    }
    const entry = mockStore.get(query)!;
    return {
      get matches() {
        return entry.matches;
      },
      media: query,
      onchange: null,
      addEventListener: vi.fn((_: string, cb: () => void) =>
        entry.listeners.add(cb)
      ),
      removeEventListener: vi.fn((_: string, cb: () => void) =>
        entry.listeners.delete(cb)
      ),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    } as unknown as MediaQueryList;
  });
}

function teardownMatchMedia() {
  delete (window as any).matchMedia;
}

/**
 * Simulate the viewport matching a media query, then flush all registered
 * change listeners so useSyncExternalStore re-reads the snapshot.
 */
function setMatchMedia(query: string, matches: boolean) {
  const entry = mockStore.get(query);
  if (!entry) return;
  entry.matches = matches;
  act(() => {
    for (const listener of entry.listeners) {
      listener();
    }
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useResponsive", () => {
  beforeEach(() => {
    setupMatchMedia();
  });

  afterEach(() => {
    teardownMatchMedia();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useResponsive).toBeDefined();
  });

  describe("initial state", () => {
    it("should return false for all default breakpoints when no media queries match", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useResponsive());

      expect(result.current.xs).toBe(false);
      expect(result.current.sm).toBe(false);
      expect(result.current.md).toBe(false);
      expect(result.current.lg).toBe(false);
      expect(result.current.xl).toBe(false);
      expect(result.current.xxl).toBe(false);
    });

    it("should return true for breakpoints whose media queries match on mount", () => {
      expect.hasAssertions();

      // Pre-populate the store so that matchMedia returns matching queries
      mockStore.set("(min-width: 0px)", { matches: true, listeners: new Set() });
      mockStore.set("(min-width: 576px)", { matches: true, listeners: new Set() });
      mockStore.set("(min-width: 768px)", { matches: true, listeners: new Set() });
      mockStore.set("(min-width: 992px)", { matches: false, listeners: new Set() });
      mockStore.set("(min-width: 1200px)", { matches: false, listeners: new Set() });
      mockStore.set("(min-width: 1600px)", { matches: false, listeners: new Set() });

      const { result } = renderHook(() => useResponsive());

      expect(result.current.xs).toBe(true);
      expect(result.current.sm).toBe(true);
      expect(result.current.md).toBe(true);
      expect(result.current.lg).toBe(false);
      expect(result.current.xl).toBe(false);
      expect(result.current.xxl).toBe(false);
    });

    it("should expose all six default breakpoint keys", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useResponsive());

      expect(result.current).toHaveProperty("xs");
      expect(result.current).toHaveProperty("sm");
      expect(result.current).toHaveProperty("md");
      expect(result.current).toHaveProperty("lg");
      expect(result.current).toHaveProperty("xl");
      expect(result.current).toHaveProperty("xxl");
    });
  });

  describe("media query subscriptions", () => {
    it("should register a listener for every breakpoint on mount", () => {
      expect.hasAssertions();
      renderHook(() => useResponsive());

      // After mount each query should have at least one active listener
      expect(mockStore.size).toBeGreaterThanOrEqual(6);
      let atLeastOneWithListeners = false;
      for (const entry of mockStore.values()) {
        if (entry.listeners.size > 0) {
          atLeastOneWithListeners = true;
          break;
        }
      }
      expect(atLeastOneWithListeners).toBe(true);
    });

    it("should remove all listeners on unmount", () => {
      expect.hasAssertions();
      const { unmount } = renderHook(() => useResponsive());

      unmount();

      for (const entry of mockStore.values()) {
        expect(entry.listeners.size).toBe(0);
      }
    });
  });

  describe("reactivity", () => {
    it("should update a breakpoint to true when the viewport widens past it", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useResponsive());

      expect(result.current.md).toBe(false);

      setMatchMedia("(min-width: 768px)", true);

      expect(result.current.md).toBe(true);
    });

    it("should update a breakpoint back to false when the viewport narrows below it", () => {
      expect.hasAssertions();

      mockStore.set("(min-width: 768px)", { matches: true, listeners: new Set() });

      const { result } = renderHook(() => useResponsive());
      expect(result.current.md).toBe(true);

      setMatchMedia("(min-width: 768px)", false);

      expect(result.current.md).toBe(false);
    });

    it("should preserve referential equality when no values change", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() => useResponsive());

      const first = result.current;
      rerender();

      expect(result.current).toBe(first);
    });

    it("should return a new object reference when a breakpoint value changes", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useResponsive());

      const before = result.current;
      setMatchMedia("(min-width: 576px)", true);
      const after = result.current;

      expect(after).not.toBe(before);
      expect(after.sm).toBe(true);
    });
  });

  describe("custom breakpoints", () => {
    it("should use custom breakpoint names and values", () => {
      expect.hasAssertions();
      const bp = { mobile: 0, tablet: 768, desktop: 1280 };

      const { result } = renderHook(() => useResponsive(bp));

      expect(result.current).toHaveProperty("mobile");
      expect(result.current).toHaveProperty("tablet");
      expect(result.current).toHaveProperty("desktop");
      expect(result.current).not.toHaveProperty("xs");
    });

    it("should react to changes in custom breakpoint media queries", () => {
      expect.hasAssertions();
      const bp = { mobile: 0, tablet: 768, desktop: 1280 };

      const { result } = renderHook(() => useResponsive(bp));
      expect(result.current.desktop).toBe(false);

      setMatchMedia("(min-width: 1280px)", true);

      expect(result.current.desktop).toBe(true);
    });
  });
});
