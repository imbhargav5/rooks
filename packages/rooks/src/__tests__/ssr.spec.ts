/**
 * @vitest-environment node
 */
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

/**
 * SSR Environment Tests
 *
 * These tests run in a Node.js environment (no window/document) to verify
 * that hooks handle SSR gracefully. We mock React's hooks since they can't
 * run outside of a React component context.
 */

describe("SSR Environment Detection", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // Mock React hooks for SSR testing
    vi.mock("react", () => ({
      useState: vi.fn((init) => [typeof init === "function" ? init() : init, vi.fn()]),
      useEffect: vi.fn(),
      useMemo: vi.fn((fn) => fn()),
      useCallback: vi.fn((fn) => fn),
      useRef: vi.fn((init) => ({ current: init })),
    }));
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should confirm window is undefined in node environment", () => {
    expect.hasAssertions();
    expect(typeof window).toBe("undefined");
  });

  describe("useMediaMatch SSR", () => {
    it("should return defaultServerRenderedValue when window is undefined", async () => {
      expect.hasAssertions();

      const { useMediaMatch } = await import("@/hooks/useMediaMatch");

      // Default value is false
      const result1 = useMediaMatch("(max-width: 600px)");
      expect(result1).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "useMediaMatch cannot function as window is undefined."
      );

      consoleWarnSpy.mockClear();

      // Custom default value
      const result2 = useMediaMatch("(max-width: 600px)", true);
      expect(result2).toBe(true);
    });
  });

  describe("useBroadcastChannel SSR", () => {
    it("should return isSupported=false when window is undefined", async () => {
      expect.hasAssertions();

      const { useBroadcastChannel } = await import("@/hooks/useBroadcastChannel");

      const result = useBroadcastChannel("test-channel");
      expect(result.isSupported).toBe(false);
    });
  });

  describe("useMeasure SSR", () => {
    it("should handle SSR gracefully", async () => {
      expect.hasAssertions();

      const { useMeasure } = await import("@/hooks/useMeasure");

      // The hook should not throw in SSR
      expect(() => useMeasure()).not.toThrow();
    });
  });
});
