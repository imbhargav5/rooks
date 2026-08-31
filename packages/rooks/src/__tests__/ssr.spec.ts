/**
 * @vitest-environment node
 */
import { PassThrough } from "node:stream";
import { createElement, Suspense } from "react";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

function renderHookOnServer<T>(useHook: () => T): T {
  let result!: T;

  function ServerHookHarness() {
    // The server renderer is synchronous; capture the hook's server snapshot
    // so each test can assert it after React completes the render.
    // eslint-disable-next-line react-hooks/globals
    result = useHook();
    return null;
  }

  renderToString(createElement(ServerHookHarness));

  return result;
}

function renderSuspendingHookOnServer(useHook: () => unknown): Promise<string> {
  function ServerHookHarness() {
    useHook();
    return null;
  }

  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = "";

    output.setEncoding("utf8");
    output.on("data", (chunk: string) => {
      html += chunk;
    });
    output.on("end", () => resolve(html));
    output.on("error", reject);

    const stream = renderToPipeableStream(
      createElement(
        "div",
        null,
        createElement("span", { hidden: true }, "SSR shell"),
        createElement(
          Suspense,
          { fallback: createElement("span", null, "Loading") },
          createElement(ServerHookHarness)
        )
      ),
      {
        onError: reject,
        onShellError: reject,
        onShellReady() {
          stream.pipe(output);
        },
      }
    );
  });
}

/**
 * SSR Environment Tests
 *
 * These tests run in a Node.js environment (no window/document) and render
 * hooks through React's server renderer to verify their real SSR behavior.
 */

describe("SSR Environment Detection", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
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

  // ============================================
  // Browser API Hooks - Window/Document Events
  // ============================================

  describe("useMediaMatch SSR", () => {
    it("should return defaultServerRenderedValue when window is undefined", async () => {
      expect.hasAssertions();

      const { useMediaMatch } = await import("@/hooks/useMediaMatch");

      // Default value is false (via getServerSnapshot)
      const result1 = renderHookOnServer(() =>
        useMediaMatch("(max-width: 600px)")
      );
      expect(result1).toBe(false);

      // Custom default value
      const result2 = renderHookOnServer(() =>
        useMediaMatch("(max-width: 600px)", true)
      );
      expect(result2).toBe(true);

      // No console warning with useSyncExternalStore approach
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe("useBroadcastChannel SSR", () => {
    it("should return isSupported=false when window is undefined", async () => {
      expect.hasAssertions();

      const { useBroadcastChannel } =
        await import("@/hooks/useBroadcastChannel");

      const result = renderHookOnServer(() =>
        useBroadcastChannel("test-channel")
      );
      expect(result.isSupported).toBe(false);
    });
  });

  describe("useTemporalNow SSR", () => {
    it("should return null when rendered on the server", async () => {
      expect.hasAssertions();

      const { useTemporalNow } = await import("@/hooks/useTemporalNow");

      expect(() => renderHookOnServer(() => useTemporalNow())).not.toThrow();
      expect(renderHookOnServer(() => useTemporalNow())).toBe(null);
    });
  });

  describe("useTemporalCountdown SSR", () => {
    it("should return null when rendered on the server", async () => {
      expect.hasAssertions();

      const { useTemporalCountdown } =
        await import("@/hooks/useTemporalCountdown");

      const result = renderHookOnServer(() =>
        useTemporalCountdown({
          target: "2099-01-01T00:00:00Z",
        })
      );
      expect(result).toBe(null);
    });
  });

  describe("useTemporalElapsed SSR", () => {
    it("should return null when rendered on the server", async () => {
      expect.hasAssertions();

      const { useTemporalElapsed } = await import("@/hooks/useTemporalElapsed");

      expect(() =>
        renderHookOnServer(() => useTemporalElapsed())
      ).not.toThrow();
      expect(renderHookOnServer(() => useTemporalElapsed())).toBe(null);
    });
  });

  describe("useTemporalAge SSR", () => {
    it("should return null when rendered on the server", async () => {
      expect.hasAssertions();

      const { useTemporalAge } = await import("@/hooks/useTemporalAge");

      const result = renderHookOnServer(() =>
        useTemporalAge({
          date: "1990-01-01",
          timeZone: "UTC",
        })
      );
      expect(result).toBe(null);
    });
  });

  describe("useMeasure SSR", () => {
    it("should handle SSR gracefully", async () => {
      expect.hasAssertions();

      const { useMeasure } = await import("@/hooks/useMeasure");

      // The hook should not throw in SSR
      expect(() => renderHookOnServer(() => useMeasure())).not.toThrow();
    });
  });

  describe("useWindowEventListener SSR", () => {
    it("should not throw when window is undefined", async () => {
      expect.hasAssertions();
      const { useWindowEventListener } =
        await import("@/hooks/useWindowEventListener");
      expect(() =>
        renderHookOnServer(() => useWindowEventListener("click", vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useDocumentEventListener SSR", () => {
    it("should not throw when document is undefined", async () => {
      expect.hasAssertions();
      const { useDocumentEventListener } =
        await import("@/hooks/useDocumentEventListener");
      expect(() =>
        renderHookOnServer(() => useDocumentEventListener("click", vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useEventListener SSR", () => {
    it("should not throw when target is null", async () => {
      expect.hasAssertions();
      const { useEventListener } = await import("@/hooks/useEventListener");
      expect(() =>
        renderHookOnServer(() =>
          useEventListener("click", vi.fn(), { target: null })
        )
      ).not.toThrow();
    });
  });

  describe("useBrowserCookieState SSR", () => {
    it("should throw when document is undefined", async () => {
      expect.hasAssertions();
      const { BROWSER_COOKIE_STATE_ERROR_MESSAGE, useBrowserCookieState } =
        await import("@/hooks/useBrowserCookieState");

      expect(() =>
        renderHookOnServer(() =>
          useBrowserCookieState("theme", "light", { path: "/" })
        )
      ).toThrow(BROWSER_COOKIE_STATE_ERROR_MESSAGE);
    });
  });

  describe("useOnWindowScroll SSR", () => {
    it("should not throw when window is undefined", async () => {
      expect.hasAssertions();
      const { useOnWindowScroll } = await import("@/hooks/useOnWindowScroll");
      expect(() =>
        renderHookOnServer(() => useOnWindowScroll(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useOnWindowResize SSR", () => {
    it("should not throw when window is undefined", async () => {
      expect.hasAssertions();
      const { useOnWindowResize } = await import("@/hooks/useOnWindowResize");
      expect(() =>
        renderHookOnServer(() => useOnWindowResize(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useGlobalObjectEventListener SSR", () => {
    it("should not throw when global object is undefined", async () => {
      expect.hasAssertions();
      const { useGlobalObjectEventListener } =
        await import("@/hooks/useGlobalObjectEventListener");
      expect(() =>
        renderHookOnServer(() =>
          useGlobalObjectEventListener(
            undefined,
            "click",
            vi.fn(),
            {},
            true,
            false
          )
        )
      ).not.toThrow();
    });
  });

  // ============================================
  // Click/Touch Hooks
  // ============================================

  describe("useOutsideClick SSR", () => {
    it("should not throw when document is undefined", async () => {
      expect.hasAssertions();
      const { useOutsideClick } = await import("@/hooks/useOutsideClick");
      const ref = { current: null };
      expect(() =>
        renderHookOnServer(() => useOutsideClick(ref, vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useOutsideClickRef SSR", () => {
    it("should not throw when document is undefined", async () => {
      expect.hasAssertions();
      const { useOutsideClickRef } = await import("@/hooks/useOutsideClickRef");
      expect(() =>
        renderHookOnServer(() => useOutsideClickRef(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useOnClickRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useOnClickRef } = await import("@/hooks/useOnClickRef");
      expect(() =>
        renderHookOnServer(() => useOnClickRef(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useOnHoverRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useOnHoverRef } = await import("@/hooks/useOnHoverRef");
      expect(() =>
        renderHookOnServer(() => useOnHoverRef(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useOnLongPress SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useOnLongPress } = await import("@/hooks/useOnLongPress");
      expect(() =>
        renderHookOnServer(() => useOnLongPress(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useOnLongHover SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useOnLongHover } = await import("@/hooks/useOnLongHover");
      expect(() =>
        renderHookOnServer(() => useOnLongHover(vi.fn()))
      ).not.toThrow();
    });
  });

  // ============================================
  // Window/Screen Dimension Hooks
  // ============================================

  describe("useWindowSize SSR", () => {
    it("should return null dimensions when window is undefined", async () => {
      expect.hasAssertions();
      const { useWindowSize } = await import("@/hooks/useWindowSize");
      const result = renderHookOnServer(() => useWindowSize());
      expect(result.innerHeight).toBe(null);
      expect(result.innerWidth).toBe(null);
      expect(result.outerHeight).toBe(null);
      expect(result.outerWidth).toBe(null);
    });
  });

  describe("useWindowScrollPosition SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useWindowScrollPosition } =
        await import("@/hooks/useWindowScrollPosition");
      expect(() =>
        renderHookOnServer(() => useWindowScrollPosition())
      ).not.toThrow();
    });
  });

  describe("useOrientation SSR", () => {
    it("should return null when window is undefined", async () => {
      expect.hasAssertions();
      const { useOrientation } = await import("@/hooks/useOrientation");
      const result = renderHookOnServer(() => useOrientation());
      expect(result).toBe(null);
    });
  });

  describe("useDimensionsRef SSR", () => {
    it("should handle SSR gracefully", async () => {
      expect.hasAssertions();
      const { useDimensionsRef } = await import("@/hooks/useDimensionsRef");
      expect(() => renderHookOnServer(() => useDimensionsRef())).not.toThrow();
    });
  });

  // ============================================
  // Storage Hooks
  // ============================================

  describe("useLocalstorageState SSR", () => {
    it("should return initial value when localStorage is undefined", async () => {
      expect.hasAssertions();
      const { useLocalstorageState } =
        await import("@/hooks/useLocalstorageState");
      const [value] = renderHookOnServer(() =>
        useLocalstorageState("test-key", "initial")
      );
      expect(value).toBe("initial");
    });
  });

  describe("useSessionstorageState SSR", () => {
    it("should return initial value when sessionStorage is undefined", async () => {
      expect.hasAssertions();
      const { useSessionstorageState } =
        await import("@/hooks/useSessionstorageState");
      const [value] = renderHookOnServer(() =>
        useSessionstorageState("test-key", "initial")
      );
      expect(value).toBe("initial");
    });
  });

  // ============================================
  // Suspense Hooks
  // ============================================

  describe("useSuspenseLocalStorageState SSR", () => {
    it("should render its Suspense fallback", async () => {
      expect.hasAssertions();
      const { useSuspenseLocalStorageState } =
        await import("@/hooks/useSuspenseLocalStorageState");

      const html = await renderSuspendingHookOnServer(() =>
        useSuspenseLocalStorageState("test-key", (val) => val ?? "default")
      );

      expect(html).toContain("Loading");
    });
  });

  describe("useSuspenseSessionStorageState SSR", () => {
    it("should render its Suspense fallback", async () => {
      expect.hasAssertions();
      const { useSuspenseSessionStorageState } =
        await import("@/hooks/useSuspenseSessionStorageState");

      const html = await renderSuspendingHookOnServer(() =>
        useSuspenseSessionStorageState("test-key", (val) => val ?? "default")
      );

      expect(html).toContain("Loading");
    });
  });

  describe("useSuspenseIndexedDBState SSR", () => {
    it("should render its Suspense fallback", async () => {
      expect.hasAssertions();
      const { useSuspenseIndexedDBState } =
        await import("@/hooks/useSuspenseIndexedDBState");

      const html = await renderSuspendingHookOnServer(() =>
        useSuspenseIndexedDBState("test-key", (val) => val ?? "default", {
          dbName: "test-db",
          storeName: "test-store",
        })
      );

      expect(html).toContain("Loading");
    });
  });

  describe("useSuspenseNavigatorBattery SSR", () => {
    it("should throw (Promise or Error) in SSR", async () => {
      expect.hasAssertions();
      const { useSuspenseNavigatorBattery } =
        await import("@/hooks/useSuspenseNavigatorBattery");
      expect(() =>
        renderHookOnServer(() => useSuspenseNavigatorBattery())
      ).toThrow();
    });
  });

  describe("useSuspenseFavicon SSR", () => {
    it("should throw a browser-only error in SSR", async () => {
      expect.hasAssertions();
      const { useSuspenseFavicon } = await import("@/hooks/useSuspenseFavicon");
      expect(() => renderHookOnServer(() => useSuspenseFavicon())).toThrow(
        "useSuspenseFavicon can only be used in a browser environment."
      );
    });
  });

  describe("useSuspenseNavigatorUserAgentData SSR", () => {
    it("should throw (Promise or Error) in SSR", async () => {
      expect.hasAssertions();
      const { useSuspenseNavigatorUserAgentData } =
        await import("@/hooks/useSuspenseNavigatorUserAgentData");
      expect(() =>
        renderHookOnServer(() => useSuspenseNavigatorUserAgentData())
      ).toThrow();
    });
  });

  // ============================================
  // Clipboard/Share Hooks (isSupported pattern)
  // ============================================

  describe("useClipboard SSR", () => {
    it("should return isSupported=false when navigator is undefined", async () => {
      expect.hasAssertions();
      const { useClipboard } = await import("@/hooks/useClipboard");
      const result = renderHookOnServer(() => useClipboard());
      expect(result.isSupported).toBe(false);
    });
  });

  describe("useShare SSR", () => {
    it("should return isSupported=false when navigator is undefined", async () => {
      expect.hasAssertions();
      const { useShare } = await import("@/hooks/useShare");
      const result = renderHookOnServer(() => useShare());
      expect(result.isSupported).toBe(false);
    });
  });

  // ============================================
  // Network/Online Hooks
  // ============================================

  describe("useOnline SSR", () => {
    it("should return null when window is undefined", async () => {
      expect.hasAssertions();
      const { useOnline } = await import("@/hooks/useOnline");
      const result = renderHookOnServer(() => useOnline());
      expect(result).toBe(null);
    });
  });

  describe("useNetworkInformation SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useNetworkInformation } =
        await import("@/hooks/useNetworkInformation");
      expect(() =>
        renderHookOnServer(() => useNetworkInformation())
      ).not.toThrow();
    });
  });

  // ============================================
  // Keyboard Hooks
  // ============================================

  describe("useKey SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useKey } = await import("@/hooks/useKey");
      expect(() =>
        renderHookOnServer(() => useKey(["Enter"], vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useKeys SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useKeys } = await import("@/hooks/useKeys");
      expect(() =>
        renderHookOnServer(() => useKeys(["Enter", "Escape"], vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useKeyBindings SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useKeyBindings } = await import("@/hooks/useKeyBindings");
      expect(() =>
        renderHookOnServer(() => useKeyBindings({ Enter: vi.fn() }))
      ).not.toThrow();
    });
  });

  describe("useKeyRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useKeyRef } = await import("@/hooks/useKeyRef");
      expect(() =>
        renderHookOnServer(() => useKeyRef(["Enter"], vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useOnStartTyping SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useOnStartTyping } = await import("@/hooks/useOnStartTyping");
      expect(() =>
        renderHookOnServer(() => useOnStartTyping(vi.fn()))
      ).not.toThrow();
    });
  });

  // ============================================
  // Mouse Hooks
  // ============================================

  describe("useMouse SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMouse } = await import("@/hooks/useMouse");
      expect(() => renderHookOnServer(() => useMouse())).not.toThrow();
    });
  });

  describe("useMouseMoveDelta SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMouseMoveDelta } = await import("@/hooks/useMouseMoveDelta");
      expect(() => renderHookOnServer(() => useMouseMoveDelta())).not.toThrow();
    });
  });

  describe("useMouseWheelDelta SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMouseWheelDelta } = await import("@/hooks/useMouseWheelDelta");
      expect(() =>
        renderHookOnServer(() => useMouseWheelDelta())
      ).not.toThrow();
    });
  });

  // ============================================
  // Document Hooks
  // ============================================

  describe("useDocumentTitle SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDocumentTitle } = await import("@/hooks/useDocumentTitle");
      expect(() =>
        renderHookOnServer(() => useDocumentTitle("Test Title"))
      ).not.toThrow();
    });
  });

  describe("useDocumentVisibilityState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDocumentVisibilityState } =
        await import("@/hooks/useDocumentVisibilityState");
      expect(() =>
        renderHookOnServer(() => useDocumentVisibilityState())
      ).not.toThrow();
    });
  });

  describe("useLockBodyScroll SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useLockBodyScroll } = await import("@/hooks/useLockBodyScroll");
      expect(() =>
        renderHookOnServer(() => useLockBodyScroll(true))
      ).not.toThrow();
    });
  });

  describe("usePageLeave SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePageLeave } = await import("@/hooks/usePageLeave");
      expect(() =>
        renderHookOnServer(() => usePageLeave(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useBeforeUnload SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useBeforeUnload } = await import("@/hooks/useBeforeUnload");
      expect(() => renderHookOnServer(() => useBeforeUnload())).not.toThrow();
    });
  });

  // ============================================
  // Observer Hooks
  // ============================================

  describe("useInViewRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useInViewRef } = await import("@/hooks/useInViewRef");
      expect(() => renderHookOnServer(() => useInViewRef())).not.toThrow();
    });
  });

  describe("useIntersectionObserverRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useIntersectionObserverRef } =
        await import("@/hooks/useIntersectionObserverRef");
      expect(() =>
        renderHookOnServer(() => useIntersectionObserverRef(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useMutationObserver SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMutationObserver } =
        await import("@/hooks/useMutationObserver");
      const ref = { current: null };
      expect(() =>
        renderHookOnServer(() => useMutationObserver(ref, vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useMutationObserverRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMutationObserverRef } =
        await import("@/hooks/useMutationObserverRef");
      expect(() =>
        renderHookOnServer(() => useMutationObserverRef(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useResizeObserverRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useResizeObserverRef } =
        await import("@/hooks/useResizeObserverRef");
      expect(() =>
        renderHookOnServer(() => useResizeObserverRef(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useBoundingclientrect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useBoundingclientrect } =
        await import("@/hooks/useBoundingclientrect");
      const ref = { current: null };
      expect(() =>
        renderHookOnServer(() => useBoundingclientrect(ref))
      ).not.toThrow();
    });
  });

  describe("useBoundingclientrectRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useBoundingclientrectRef } =
        await import("@/hooks/useBoundingclientrectRef");
      expect(() =>
        renderHookOnServer(() => useBoundingclientrectRef())
      ).not.toThrow();
    });
  });

  // ============================================
  // Geolocation/Device Hooks
  // ============================================

  describe("useGeolocation SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useGeolocation } = await import("@/hooks/useGeolocation");
      expect(() => renderHookOnServer(() => useGeolocation())).not.toThrow();
    });
  });

  describe("useNavigatorLanguage SSR", () => {
    it("should return null when navigator is undefined", async () => {
      expect.hasAssertions();
      const { useNavigatorLanguage } =
        await import("@/hooks/useNavigatorLanguage");
      const result = renderHookOnServer(() => useNavigatorLanguage());
      expect(result).toBe(null);
    });
  });

  // ============================================
  // Media Preferences Hooks
  // ============================================

  describe("usePreferredColorScheme SSR", () => {
    it("should return null colorScheme when window is undefined", async () => {
      expect.hasAssertions();
      const { usePreferredColorScheme } =
        await import("@/hooks/usePreferredColorScheme");
      const result = renderHookOnServer(() => usePreferredColorScheme());
      expect(result.colorScheme).toBe(null);
    });
  });

  describe("usePrefersReducedMotion SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePrefersReducedMotion } =
        await import("@/hooks/usePrefersReducedMotion");
      expect(() =>
        renderHookOnServer(() => usePrefersReducedMotion())
      ).not.toThrow();
    });
  });

  // ============================================
  // Media/Audio/Video Hooks
  // ============================================

  describe("useAudio SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useAudio } = await import("@/hooks/useAudio");
      expect(() => renderHookOnServer(() => useAudio())).not.toThrow();
    });
  });

  describe("useVideo SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useVideo } = await import("@/hooks/useVideo");
      expect(() => renderHookOnServer(() => useVideo())).not.toThrow();
    });
  });

  describe("useMediaRecorder SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMediaRecorder } = await import("@/hooks/useMediaRecorder");
      expect(() =>
        renderHookOnServer(() => useMediaRecorder(null))
      ).not.toThrow();
    });
  });

  describe("useSpeech SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSpeech } = await import("@/hooks/useSpeech");
      expect(() =>
        renderHookOnServer(() => useSpeech({ text: "Hello" }))
      ).not.toThrow();
    });
  });

  describe("useVibrate SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useVibrate } = await import("@/hooks/useVibrate");
      expect(() =>
        renderHookOnServer(() =>
          useVibrate({ isEnabled: true, pattern: [100, 200, 100] })
        )
      ).not.toThrow();
    });
  });

  // ============================================
  // Fullscreen/Picture-in-Picture Hooks
  // ============================================

  describe("useFullscreen SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFullscreen } = await import("@/hooks/useFullscreen");
      expect(() => renderHookOnServer(() => useFullscreen())).not.toThrow();
    });
  });

  describe("usePictureInPictureApi SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePictureInPictureApi } =
        await import("@/hooks/usePictureInPictureApi");
      const ref = { current: null };
      expect(() =>
        renderHookOnServer(() => usePictureInPictureApi(ref))
      ).not.toThrow();
    });
  });

  // ============================================
  // Web API Hooks
  // ============================================

  describe("useNotification SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useNotification } = await import("@/hooks/useNotification");
      expect(() => renderHookOnServer(() => useNotification())).not.toThrow();
    });
  });

  describe("useIdleDetectionApi SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useIdleDetectionApi } =
        await import("@/hooks/useIdleDetectionApi");
      expect(() =>
        renderHookOnServer(() => useIdleDetectionApi())
      ).not.toThrow();
    });
  });

  describe("useScreenDetailsApi SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useScreenDetailsApi } =
        await import("@/hooks/useScreenDetailsApi");
      expect(() =>
        renderHookOnServer(() => useScreenDetailsApi())
      ).not.toThrow();
    });
  });

  describe("useWebLocksApi SSR", () => {
    it("should not throw in SSR with valid resource name", async () => {
      expect.hasAssertions();
      const { useWebLocksApi } = await import("@/hooks/useWebLocksApi");
      expect(() =>
        renderHookOnServer(() => useWebLocksApi("test-resource"))
      ).not.toThrow();
    });
  });

  describe("useWebWorker SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useWebWorker } = await import("@/hooks/useWebWorker");
      expect(() =>
        renderHookOnServer(() => useWebWorker("worker.js"))
      ).not.toThrow();
    });
  });

  // ============================================
  // Focus Hooks
  // ============================================

  describe("useFocus SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFocus } = await import("@/hooks/useFocus");
      expect(() => renderHookOnServer(() => useFocus({}))).not.toThrow();
    });
  });

  describe("useFocusWithin SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFocusWithin } = await import("@/hooks/useFocusWithin");
      expect(() => renderHookOnServer(() => useFocusWithin({}))).not.toThrow();
    });
  });

  // ============================================
  // File/Drag-Drop Hooks
  // ============================================

  describe("useFileDropRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFileDropRef } = await import("@/hooks/useFileDropRef");
      expect(() =>
        renderHookOnServer(() => useFileDropRef({}, { onDrop: vi.fn() }))
      ).not.toThrow();
    });
  });

  describe("useIsDroppingFiles SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useIsDroppingFiles } = await import("@/hooks/useIsDroppingFiles");
      expect(() =>
        renderHookOnServer(() => useIsDroppingFiles())
      ).not.toThrow();
    });
  });

  // ============================================
  // Fetch Hook
  // ============================================

  describe("useFetch SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFetch } = await import("@/hooks/useFetch");
      expect(() =>
        renderHookOnServer(() => useFetch("https://example.com/api"))
      ).not.toThrow();
    });
  });

  // ============================================
  // Pure State Hooks
  // ============================================

  describe("useCounter SSR", () => {
    it("should initialize with given value", async () => {
      expect.hasAssertions();
      const { useCounter } = await import("@/hooks/useCounter");
      const result = renderHookOnServer(() => useCounter(5));
      expect(result.value).toBe(5);
    });
  });

  describe("useToggle SSR", () => {
    it("should initialize with given value", async () => {
      expect.hasAssertions();
      const { useToggle } = await import("@/hooks/useToggle");
      const [value] = renderHookOnServer(() => useToggle(true));
      expect(value).toBe(true);
    });
  });

  describe("useArrayState SSR", () => {
    it("should initialize with given array", async () => {
      expect.hasAssertions();
      const { useArrayState } = await import("@/hooks/useArrayState");
      const [value] = renderHookOnServer(() => useArrayState([1, 2, 3]));
      expect(value).toEqual([1, 2, 3]);
    });
  });

  describe("useMapState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMapState } = await import("@/hooks/useMapState");
      expect(() =>
        renderHookOnServer(() => useMapState({ key: "value" }))
      ).not.toThrow();
    });
  });

  describe("useNativeMapState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useNativeMapState } = await import("@/hooks/useNativeMapState");
      expect(() => renderHookOnServer(() => useNativeMapState())).not.toThrow();
    });
  });

  describe("useQueueState SSR", () => {
    it("should initialize with given array", async () => {
      expect.hasAssertions();
      const { useQueueState } = await import("@/hooks/useQueueState");
      const [value] = renderHookOnServer(() => useQueueState([1, 2, 3]));
      expect(value).toEqual([1, 2, 3]);
    });
  });

  describe("useStackState SSR", () => {
    it("should initialize with given array", async () => {
      expect.hasAssertions();
      const { useStackState } = await import("@/hooks/useStackState");
      const [value] = renderHookOnServer(() => useStackState([1, 2, 3]));
      expect(value).toEqual([1, 2, 3]);
    });
  });

  describe("useSetState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSetState } = await import("@/hooks/useSetState");
      expect(() =>
        renderHookOnServer(() => useSetState(new Set(["value"])))
      ).not.toThrow();
    });
  });

  describe("useFormState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFormState } = await import("@/hooks/useFormState");
      expect(() =>
        renderHookOnServer(() =>
          useFormState({ initialValues: { name: "test" } })
        )
      ).not.toThrow();
    });
  });

  describe("useInput SSR", () => {
    it("should initialize with given value", async () => {
      expect.hasAssertions();
      const { useInput } = await import("@/hooks/useInput");
      const result = renderHookOnServer(() => useInput("initial"));
      expect(result.value).toBe("initial");
    });
  });

  describe("useIsClient SSR", () => {
    it("should return false when rendered on the server", async () => {
      expect.hasAssertions();
      const { useIsClient } = await import("@/hooks/useIsClient");
      expect(renderHookOnServer(() => useIsClient())).toBe(false);
    });
  });

  describe("useLocationSnapshot SSR", () => {
    it("should return null when window is undefined", async () => {
      expect.hasAssertions();
      const { useLocationSnapshot } =
        await import("@/hooks/useLocationSnapshot");
      expect(renderHookOnServer(() => useLocationSnapshot())).toBe(null);
    });
  });

  describe("useLocationHash SSR", () => {
    it("should return null when window is undefined", async () => {
      expect.hasAssertions();
      const { useLocationHash } = await import("@/hooks/useLocationHash");
      expect(renderHookOnServer(() => useLocationHash())).toBe(null);
    });
  });

  describe("useLocationSearchParam SSR", () => {
    it("should return null when window is undefined", async () => {
      expect.hasAssertions();
      const { useLocationSearchParam } =
        await import("@/hooks/useLocationSearchParam");
      expect(renderHookOnServer(() => useLocationSearchParam("test"))).toBe(
        null
      );
    });
  });

  describe("useCheckboxInputState SSR", () => {
    it("should initialize with given value", async () => {
      expect.hasAssertions();
      const { useCheckboxInputState } =
        await import("@/hooks/useCheckboxInputState");
      const result = renderHookOnServer(() => useCheckboxInputState(true));
      expect(result.checked).toBe(true);
    });
  });

  describe("useSelect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSelect } = await import("@/hooks/useSelect");
      expect(() =>
        renderHookOnServer(() => useSelect([{ value: "a", label: "A" }], 0))
      ).not.toThrow();
    });
  });

  describe("useSelectableList SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSelectableList } = await import("@/hooks/useSelectableList");
      expect(() =>
        renderHookOnServer(() => useSelectableList([1, 2, 3]))
      ).not.toThrow();
    });
  });

  describe("useMultiSelectableList SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMultiSelectableList } =
        await import("@/hooks/useMultiSelectableList");
      expect(() =>
        renderHookOnServer(() => useMultiSelectableList([1, 2, 3]))
      ).not.toThrow();
    });
  });

  describe("useUndoState SSR", () => {
    it("should initialize with given value", async () => {
      expect.hasAssertions();
      const { useUndoState } = await import("@/hooks/useUndoState");
      const [value] = renderHookOnServer(() => useUndoState("initial"));
      expect(value).toBe("initial");
    });
  });

  describe("useUndoRedoState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useUndoRedoState } = await import("@/hooks/useUndoRedoState");
      expect(() =>
        renderHookOnServer(() => useUndoRedoState("initial"))
      ).not.toThrow();
    });
  });

  describe("useTimeTravelState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useTimeTravelState } = await import("@/hooks/useTimeTravelState");
      expect(() =>
        renderHookOnServer(() => useTimeTravelState("initial"))
      ).not.toThrow();
    });
  });

  describe("usePreviousImmediate SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePreviousImmediate } =
        await import("@/hooks/usePreviousImmediate");
      expect(() =>
        renderHookOnServer(() => usePreviousImmediate("value"))
      ).not.toThrow();
    });
  });

  describe("usePreviousDifferent SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePreviousDifferent } =
        await import("@/hooks/usePreviousDifferent");
      expect(() =>
        renderHookOnServer(() => usePreviousDifferent("value"))
      ).not.toThrow();
    });
  });

  // ============================================
  // Timing Hooks
  // ============================================

  describe("useCountdown SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useCountdown } = await import("@/hooks/useCountdown");
      expect(() =>
        renderHookOnServer(() => useCountdown(new Date(Date.now() + 10000)))
      ).not.toThrow();
    });
  });

  describe("useDebounce SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDebounce } = await import("@/hooks/useDebounce");
      expect(() =>
        renderHookOnServer(() => useDebounce(vi.fn(), 500))
      ).not.toThrow();
    });
  });

  describe("useDebounceFn SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDebounceFn } = await import("@/hooks/useDebounceFn");
      expect(() =>
        renderHookOnServer(() => useDebounceFn(vi.fn(), 500))
      ).not.toThrow();
    });
  });

  describe("useDebouncedValue SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDebouncedValue } = await import("@/hooks/useDebouncedValue");
      expect(() =>
        renderHookOnServer(() => useDebouncedValue("value", 500))
      ).not.toThrow();
    });
  });

  describe("useThrottle SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useThrottle } = await import("@/hooks/useThrottle");
      expect(() =>
        renderHookOnServer(() => useThrottle(vi.fn(), 500))
      ).not.toThrow();
    });
  });

  describe("useIntervalWhen SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useIntervalWhen } = await import("@/hooks/useIntervalWhen");
      expect(() =>
        renderHookOnServer(() => useIntervalWhen(vi.fn(), 1000))
      ).not.toThrow();
    });
  });

  describe("useTimeoutWhen SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useTimeoutWhen } = await import("@/hooks/useTimeoutWhen");
      expect(() =>
        renderHookOnServer(() => useTimeoutWhen(vi.fn(), 1000))
      ).not.toThrow();
    });
  });

  // ============================================
  // Animation Hooks
  // ============================================

  describe("useAnimation SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useAnimation } = await import("@/hooks/useAnimation");
      expect(() =>
        renderHookOnServer(() => useAnimation({ duration: 1000 }))
      ).not.toThrow();
    });
  });

  describe("useSpring SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSpring } = await import("@/hooks/useSpring");
      expect(() => renderHookOnServer(() => useSpring(0))).not.toThrow();
    });
  });

  describe("useTween SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useTween } = await import("@/hooks/useTween");
      expect(() => renderHookOnServer(() => useTween())).not.toThrow();
    });
  });

  describe("useRaf SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useRaf } = await import("@/hooks/useRaf");
      expect(() =>
        renderHookOnServer(() => useRaf(vi.fn(), true))
      ).not.toThrow();
    });
  });

  // ============================================
  // Effect/Lifecycle Hooks
  // ============================================

  describe("useDidMount SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDidMount } = await import("@/hooks/useDidMount");
      expect(() =>
        renderHookOnServer(() => useDidMount(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useDidUpdate SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDidUpdate } = await import("@/hooks/useDidUpdate");
      expect(() =>
        renderHookOnServer(() => useDidUpdate(vi.fn(), []))
      ).not.toThrow();
    });
  });

  describe("useWillUnmount SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useWillUnmount } = await import("@/hooks/useWillUnmount");
      expect(() =>
        renderHookOnServer(() => useWillUnmount(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useEffectOnceWhen SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useEffectOnceWhen } = await import("@/hooks/useEffectOnceWhen");
      expect(() =>
        renderHookOnServer(() => useEffectOnceWhen(vi.fn(), true))
      ).not.toThrow();
    });
  });

  describe("useAsyncEffect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useAsyncEffect } = await import("@/hooks/useAsyncEffect");
      expect(() =>
        renderHookOnServer(() => useAsyncEffect(async () => {}, []))
      ).not.toThrow();
    });
  });

  describe("useDebouncedEffect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDebouncedEffect } = await import("@/hooks/useDebouncedEffect");
      expect(() =>
        renderHookOnServer(() => useDebouncedEffect(vi.fn(), [], 500))
      ).not.toThrow();
    });
  });

  describe("useDebouncedAsyncEffect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDebouncedAsyncEffect } =
        await import("@/hooks/useDebouncedAsyncEffect");
      expect(() =>
        renderHookOnServer(() =>
          useDebouncedAsyncEffect(async () => {}, [], 500)
        )
      ).not.toThrow();
    });
  });

  describe("useDeepCompareEffect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDeepCompareEffect } =
        await import("@/hooks/useDeepCompareEffect");
      expect(() =>
        renderHookOnServer(() => useDeepCompareEffect(vi.fn(), [{ a: 1 }]))
      ).not.toThrow();
    });
  });

  describe("useIsomorphicEffect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useIsomorphicEffect } =
        await import("@/hooks/useIsomorphicEffect");
      expect(() =>
        renderHookOnServer(() => useIsomorphicEffect(vi.fn(), []))
      ).not.toThrow();
    });
  });

  // ============================================
  // Ref Hooks
  // ============================================

  describe("useFreshRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFreshRef } = await import("@/hooks/useFreshRef");
      expect(() =>
        renderHookOnServer(() => useFreshRef("value"))
      ).not.toThrow();
    });
  });

  describe("useFreshCallback SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFreshCallback } = await import("@/hooks/useFreshCallback");
      expect(() =>
        renderHookOnServer(() => useFreshCallback(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useFreshTick SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFreshTick } = await import("@/hooks/useFreshTick");
      expect(() =>
        renderHookOnServer(() => useFreshTick(vi.fn()))
      ).not.toThrow();
    });
  });

  describe("useForkRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useForkRef } = await import("@/hooks/useForkRef");
      expect(() =>
        renderHookOnServer(() => useForkRef(null, null))
      ).not.toThrow();
    });
  });

  describe("useMergeRefs SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMergeRefs } = await import("@/hooks/useMergeRefs");
      expect(() =>
        renderHookOnServer(() => useMergeRefs(null, null))
      ).not.toThrow();
    });
  });

  describe("useRefElement SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useRefElement } = await import("@/hooks/useRefElement");
      expect(() => renderHookOnServer(() => useRefElement())).not.toThrow();
    });
  });

  describe("useEventListenerRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useEventListenerRef } =
        await import("@/hooks/useEventListenerRef");
      expect(() =>
        renderHookOnServer(() => useEventListenerRef("click", vi.fn()))
      ).not.toThrow();
    });
  });

  // ============================================
  // Utility Hooks
  // ============================================

  describe("useGetIsMounted SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useGetIsMounted } = await import("@/hooks/useGetIsMounted");
      expect(() => renderHookOnServer(() => useGetIsMounted())).not.toThrow();
    });
  });

  describe("useSafeSetState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSafeSetState } = await import("@/hooks/useSafeSetState");
      expect(() =>
        renderHookOnServer(() => useSafeSetState("initial"))
      ).not.toThrow();
    });
  });

  describe("useRenderCount SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useRenderCount } = await import("@/hooks/useRenderCount");
      expect(() => renderHookOnServer(() => useRenderCount())).not.toThrow();
    });
  });

  describe("useWhyDidYouUpdate SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useWhyDidYouUpdate } = await import("@/hooks/useWhyDidYouUpdate");
      expect(() =>
        renderHookOnServer(() =>
          useWhyDidYouUpdate("TestComponent", { prop: "value" })
        )
      ).not.toThrow();
    });
  });

  describe("useLifecycleLogger SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useLifecycleLogger } = await import("@/hooks/useLifecycleLogger");
      expect(() =>
        renderHookOnServer(() => useLifecycleLogger("TestComponent"))
      ).not.toThrow();
    });
  });

  describe("useWarningOnMountInDevelopment SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useWarningOnMountInDevelopment } =
        await import("@/hooks/useWarningOnMountInDevelopment");
      expect(() =>
        renderHookOnServer(() => useWarningOnMountInDevelopment("Test warning"))
      ).not.toThrow();
    });
  });

  describe("usePromise SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePromise } = await import("@/hooks/usePromise");
      expect(() =>
        renderHookOnServer(() => usePromise(async () => "value"))
      ).not.toThrow();
    });
  });
});
