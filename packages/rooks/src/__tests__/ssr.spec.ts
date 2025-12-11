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
      useLayoutEffect: vi.fn(),
      useMemo: vi.fn((fn) => fn()),
      useCallback: vi.fn((fn) => fn),
      useRef: vi.fn((init) => ({ current: init })),
      useReducer: vi.fn((reducer, init) => [init, vi.fn()]),
      useSyncExternalStore: vi.fn((subscribe, getSnapshot, getServerSnapshot) =>
        getServerSnapshot ? getServerSnapshot() : null
      ),
    }));

    // Mock use-sync-external-store/shim
    vi.mock("use-sync-external-store/shim", () => ({
      useSyncExternalStore: vi.fn((subscribe, getSnapshot, getServerSnapshot) =>
        getServerSnapshot ? getServerSnapshot() : getSnapshot()
      ),
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

  // ============================================
  // Browser API Hooks - Window/Document Events
  // ============================================

  describe("useMediaMatch SSR", () => {
    it("should return defaultServerRenderedValue when window is undefined", async () => {
      expect.hasAssertions();

      const { useMediaMatch } = await import("@/hooks/useMediaMatch");

      // Default value is false (via getServerSnapshot)
      const result1 = useMediaMatch("(max-width: 600px)");
      expect(result1).toBe(false);

      // Custom default value
      const result2 = useMediaMatch("(max-width: 600px)", true);
      expect(result2).toBe(true);

      // No console warning with useSyncExternalStore approach
      expect(consoleWarnSpy).not.toHaveBeenCalled();
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

  describe("useWindowEventListener SSR", () => {
    it("should not throw when window is undefined", async () => {
      expect.hasAssertions();
      const { useWindowEventListener } = await import("@/hooks/useWindowEventListener");
      expect(() => useWindowEventListener("click", vi.fn())).not.toThrow();
    });
  });

  describe("useDocumentEventListener SSR", () => {
    it("should not throw when document is undefined", async () => {
      expect.hasAssertions();
      const { useDocumentEventListener } = await import("@/hooks/useDocumentEventListener");
      expect(() => useDocumentEventListener("click", vi.fn())).not.toThrow();
    });
  });

  describe("useOnWindowScroll SSR", () => {
    it("should not throw when window is undefined", async () => {
      expect.hasAssertions();
      const { useOnWindowScroll } = await import("@/hooks/useOnWindowScroll");
      expect(() => useOnWindowScroll(vi.fn())).not.toThrow();
    });
  });

  describe("useOnWindowResize SSR", () => {
    it("should not throw when window is undefined", async () => {
      expect.hasAssertions();
      const { useOnWindowResize } = await import("@/hooks/useOnWindowResize");
      expect(() => useOnWindowResize(vi.fn())).not.toThrow();
    });
  });

  describe("useGlobalObjectEventListener SSR", () => {
    it("should not throw when global object is undefined", async () => {
      expect.hasAssertions();
      const { useGlobalObjectEventListener } = await import("@/hooks/useGlobalObjectEventListener");
      expect(() => useGlobalObjectEventListener(undefined, "click", vi.fn())).not.toThrow();
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
      expect(() => useOutsideClick(ref, vi.fn())).not.toThrow();
    });
  });

  describe("useOutsideClickRef SSR", () => {
    it("should not throw when document is undefined", async () => {
      expect.hasAssertions();
      const { useOutsideClickRef } = await import("@/hooks/useOutsideClickRef");
      expect(() => useOutsideClickRef(vi.fn())).not.toThrow();
    });
  });

  describe("useOnClickRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useOnClickRef } = await import("@/hooks/useOnClickRef");
      expect(() => useOnClickRef(vi.fn())).not.toThrow();
    });
  });

  describe("useOnHoverRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useOnHoverRef } = await import("@/hooks/useOnHoverRef");
      expect(() => useOnHoverRef(vi.fn())).not.toThrow();
    });
  });

  describe("useOnLongPress SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useOnLongPress } = await import("@/hooks/useOnLongPress");
      expect(() => useOnLongPress(vi.fn())).not.toThrow();
    });
  });

  describe("useOnLongHover SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useOnLongHover } = await import("@/hooks/useOnLongHover");
      expect(() => useOnLongHover(vi.fn())).not.toThrow();
    });
  });

  // ============================================
  // Window/Screen Dimension Hooks
  // ============================================

  describe("useWindowSize SSR", () => {
    it("should return null dimensions when window is undefined", async () => {
      expect.hasAssertions();
      const { useWindowSize } = await import("@/hooks/useWindowSize");
      const result = useWindowSize();
      expect(result.innerHeight).toBe(null);
      expect(result.innerWidth).toBe(null);
      expect(result.outerHeight).toBe(null);
      expect(result.outerWidth).toBe(null);
    });
  });

  describe("useWindowScrollPosition SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useWindowScrollPosition } = await import("@/hooks/useWindowScrollPosition");
      expect(() => useWindowScrollPosition()).not.toThrow();
    });
  });

  describe("useOrientation SSR", () => {
    it("should return null when window is undefined", async () => {
      expect.hasAssertions();
      const { useOrientation } = await import("@/hooks/useOrientation");
      const result = useOrientation();
      expect(result).toBe(null);
    });
  });

  describe("useDimensionsRef SSR", () => {
    it("should handle SSR gracefully", async () => {
      expect.hasAssertions();
      const { useDimensionsRef } = await import("@/hooks/useDimensionsRef");
      expect(() => useDimensionsRef()).not.toThrow();
    });
  });

  // ============================================
  // Storage Hooks
  // ============================================

  describe("useLocalstorageState SSR", () => {
    it("should return initial value when localStorage is undefined", async () => {
      expect.hasAssertions();
      const { useLocalstorageState } = await import("@/hooks/useLocalstorageState");
      const [value] = useLocalstorageState("test-key", "initial");
      expect(value).toBe("initial");
    });
  });

  describe("useSessionstorageState SSR", () => {
    it("should return initial value when sessionStorage is undefined", async () => {
      expect.hasAssertions();
      const { useSessionstorageState } = await import("@/hooks/useSessionstorageState");
      const [value] = useSessionstorageState("test-key", "initial");
      expect(value).toBe("initial");
    });
  });

  // ============================================
  // Suspense Hooks (throw Promise)
  // ============================================

  describe("useSuspenseLocalStorageState SSR", () => {
    it("should throw a Promise for Suspense", async () => {
      expect.hasAssertions();
      const { useSuspenseLocalStorageState } = await import("@/hooks/useSuspenseLocalStorageState");
      try {
        useSuspenseLocalStorageState("test-key", (val) => val ?? "default");
        expect.fail("Should have thrown");
      } catch (thrown) {
        expect(thrown).toBeInstanceOf(Promise);
      }
    });
  });

  describe("useSuspenseSessionStorageState SSR", () => {
    it("should throw a Promise for Suspense", async () => {
      expect.hasAssertions();
      const { useSuspenseSessionStorageState } = await import("@/hooks/useSuspenseSessionStorageState");
      try {
        useSuspenseSessionStorageState("test-key", (val) => val ?? "default");
        expect.fail("Should have thrown");
      } catch (thrown) {
        expect(thrown).toBeInstanceOf(Promise);
      }
    });
  });

  describe("useSuspenseIndexedDBState SSR", () => {
    it("should throw a Promise for Suspense", async () => {
      expect.hasAssertions();
      const { useSuspenseIndexedDBState } = await import("@/hooks/useSuspenseIndexedDBState");
      try {
        useSuspenseIndexedDBState({
          databaseName: "test-db",
          storeName: "test-store",
          key: "test-key",
          initializer: (val) => val ?? "default",
        });
        expect.fail("Should have thrown");
      } catch (thrown) {
        expect(thrown).toBeInstanceOf(Promise);
      }
    });
  });

  describe("useSuspenseNavigatorBattery SSR", () => {
    it("should throw (Promise or Error) in SSR", async () => {
      expect.hasAssertions();
      const { useSuspenseNavigatorBattery } = await import("@/hooks/useSuspenseNavigatorBattery");
      expect(() => useSuspenseNavigatorBattery()).toThrow();
    });
  });

  describe("useSuspenseNavigatorUserAgentData SSR", () => {
    it("should throw (Promise or Error) in SSR", async () => {
      expect.hasAssertions();
      const { useSuspenseNavigatorUserAgentData } = await import("@/hooks/useSuspenseNavigatorUserAgentData");
      expect(() => useSuspenseNavigatorUserAgentData()).toThrow();
    });
  });

  // ============================================
  // Clipboard/Share Hooks (isSupported pattern)
  // ============================================

  describe("useClipboard SSR", () => {
    it("should return isSupported=false when navigator is undefined", async () => {
      expect.hasAssertions();
      const { useClipboard } = await import("@/hooks/useClipboard");
      const result = useClipboard();
      expect(result.isSupported).toBe(false);
    });
  });

  describe("useShare SSR", () => {
    it("should return isSupported=false when navigator is undefined", async () => {
      expect.hasAssertions();
      const { useShare } = await import("@/hooks/useShare");
      const result = useShare();
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
      const result = useOnline();
      expect(result).toBe(null);
    });
  });

  describe("useNetworkInformation SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useNetworkInformation } = await import("@/hooks/useNetworkInformation");
      expect(() => useNetworkInformation()).not.toThrow();
    });
  });

  // ============================================
  // Keyboard Hooks
  // ============================================

  describe("useKey SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useKey } = await import("@/hooks/useKey");
      expect(() => useKey(["Enter"], vi.fn())).not.toThrow();
    });
  });

  describe("useKeys SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useKeys } = await import("@/hooks/useKeys");
      expect(() => useKeys(["Enter", "Escape"], vi.fn())).not.toThrow();
    });
  });

  describe("useKeyBindings SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useKeyBindings } = await import("@/hooks/useKeyBindings");
      expect(() => useKeyBindings({ Enter: vi.fn() })).not.toThrow();
    });
  });

  describe("useKeyRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useKeyRef } = await import("@/hooks/useKeyRef");
      expect(() => useKeyRef(["Enter"], vi.fn())).not.toThrow();
    });
  });

  describe("useOnStartTyping SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useOnStartTyping } = await import("@/hooks/useOnStartTyping");
      expect(() => useOnStartTyping(vi.fn())).not.toThrow();
    });
  });

  // ============================================
  // Mouse Hooks
  // ============================================

  describe("useMouse SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMouse } = await import("@/hooks/useMouse");
      expect(() => useMouse()).not.toThrow();
    });
  });

  describe("useMouseMoveDelta SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMouseMoveDelta } = await import("@/hooks/useMouseMoveDelta");
      expect(() => useMouseMoveDelta()).not.toThrow();
    });
  });

  describe("useMouseWheelDelta SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMouseWheelDelta } = await import("@/hooks/useMouseWheelDelta");
      expect(() => useMouseWheelDelta()).not.toThrow();
    });
  });

  // ============================================
  // Document Hooks
  // ============================================

  describe("useDocumentTitle SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDocumentTitle } = await import("@/hooks/useDocumentTitle");
      expect(() => useDocumentTitle("Test Title")).not.toThrow();
    });
  });

  describe("useDocumentVisibilityState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDocumentVisibilityState } = await import("@/hooks/useDocumentVisibilityState");
      expect(() => useDocumentVisibilityState()).not.toThrow();
    });
  });

  describe("useLockBodyScroll SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useLockBodyScroll } = await import("@/hooks/useLockBodyScroll");
      expect(() => useLockBodyScroll()).not.toThrow();
    });
  });

  describe("usePageLeave SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePageLeave } = await import("@/hooks/usePageLeave");
      expect(() => usePageLeave(vi.fn())).not.toThrow();
    });
  });

  // ============================================
  // Observer Hooks
  // ============================================

  describe("useInViewRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useInViewRef } = await import("@/hooks/useInViewRef");
      expect(() => useInViewRef()).not.toThrow();
    });
  });

  describe("useIntersectionObserverRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useIntersectionObserverRef } = await import("@/hooks/useIntersectionObserverRef");
      expect(() => useIntersectionObserverRef(vi.fn())).not.toThrow();
    });
  });

  describe("useMutationObserver SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMutationObserver } = await import("@/hooks/useMutationObserver");
      const ref = { current: null };
      expect(() => useMutationObserver(ref, vi.fn())).not.toThrow();
    });
  });

  describe("useMutationObserverRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMutationObserverRef } = await import("@/hooks/useMutationObserverRef");
      expect(() => useMutationObserverRef(vi.fn())).not.toThrow();
    });
  });

  describe("useResizeObserverRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useResizeObserverRef } = await import("@/hooks/useResizeObserverRef");
      expect(() => useResizeObserverRef(vi.fn())).not.toThrow();
    });
  });

  describe("useBoundingclientrect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useBoundingclientrect } = await import("@/hooks/useBoundingclientrect");
      const ref = { current: null };
      expect(() => useBoundingclientrect(ref)).not.toThrow();
    });
  });

  describe("useBoundingclientrectRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useBoundingclientrectRef } = await import("@/hooks/useBoundingclientrectRef");
      expect(() => useBoundingclientrectRef()).not.toThrow();
    });
  });

  // ============================================
  // Geolocation/Device Hooks
  // ============================================

  describe("useGeolocation SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useGeolocation } = await import("@/hooks/useGeolocation");
      expect(() => useGeolocation()).not.toThrow();
    });
  });

  describe("useNavigatorLanguage SSR", () => {
    it("should return null when navigator is undefined", async () => {
      expect.hasAssertions();
      const { useNavigatorLanguage } = await import("@/hooks/useNavigatorLanguage");
      const result = useNavigatorLanguage();
      expect(result).toBe(null);
    });
  });

  // ============================================
  // Media Preferences Hooks
  // ============================================

  describe("usePreferredColorScheme SSR", () => {
    it("should return null colorScheme when window is undefined", async () => {
      expect.hasAssertions();
      const { usePreferredColorScheme } = await import("@/hooks/usePreferredColorScheme");
      const result = usePreferredColorScheme();
      expect(result.colorScheme).toBe(null);
    });
  });

  describe("usePrefersReducedMotion SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePrefersReducedMotion } = await import("@/hooks/usePrefersReducedMotion");
      expect(() => usePrefersReducedMotion()).not.toThrow();
    });
  });

  // ============================================
  // Media/Audio/Video Hooks
  // ============================================

  describe("useAudio SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useAudio } = await import("@/hooks/useAudio");
      expect(() => useAudio({ src: "test.mp3" })).not.toThrow();
    });
  });

  describe("useVideo SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useVideo } = await import("@/hooks/useVideo");
      expect(() => useVideo({ src: "test.mp4" })).not.toThrow();
    });
  });

  describe("useMediaRecorder SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMediaRecorder } = await import("@/hooks/useMediaRecorder");
      expect(() => useMediaRecorder({})).not.toThrow();
    });
  });

  describe("useSpeech SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSpeech } = await import("@/hooks/useSpeech");
      expect(() => useSpeech("Hello")).not.toThrow();
    });
  });

  describe("useVibrate SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useVibrate } = await import("@/hooks/useVibrate");
      expect(() => useVibrate([100, 200, 100])).not.toThrow();
    });
  });

  // ============================================
  // Fullscreen/Picture-in-Picture Hooks
  // ============================================

  describe("useFullscreen SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFullscreen } = await import("@/hooks/useFullscreen");
      expect(() => useFullscreen()).not.toThrow();
    });
  });

  describe("usePictureInPictureApi SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePictureInPictureApi } = await import("@/hooks/usePictureInPictureApi");
      const ref = { current: null };
      expect(() => usePictureInPictureApi(ref)).not.toThrow();
    });
  });

  // ============================================
  // Web API Hooks
  // ============================================

  describe("useNotification SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useNotification } = await import("@/hooks/useNotification");
      expect(() => useNotification()).not.toThrow();
    });
  });

  describe("useIdleDetectionApi SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useIdleDetectionApi } = await import("@/hooks/useIdleDetectionApi");
      expect(() => useIdleDetectionApi()).not.toThrow();
    });
  });

  describe("useScreenDetailsApi SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useScreenDetailsApi } = await import("@/hooks/useScreenDetailsApi");
      expect(() => useScreenDetailsApi()).not.toThrow();
    });
  });

  describe("useWebLocksApi SSR", () => {
    it("should not throw in SSR with valid resource name", async () => {
      expect.hasAssertions();
      const { useWebLocksApi } = await import("@/hooks/useWebLocksApi");
      expect(() => useWebLocksApi("test-resource")).not.toThrow();
    });
  });

  describe("useWebWorker SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useWebWorker } = await import("@/hooks/useWebWorker");
      expect(() => useWebWorker("worker.js")).not.toThrow();
    });
  });

  // ============================================
  // Focus Hooks
  // ============================================

  describe("useFocus SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFocus } = await import("@/hooks/useFocus");
      expect(() => useFocus({})).not.toThrow();
    });
  });

  describe("useFocusWithin SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFocusWithin } = await import("@/hooks/useFocusWithin");
      expect(() => useFocusWithin({})).not.toThrow();
    });
  });

  // ============================================
  // File/Drag-Drop Hooks
  // ============================================

  describe("useFileDropRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFileDropRef } = await import("@/hooks/useFileDropRef");
      expect(() => useFileDropRef({ onDrop: vi.fn() })).not.toThrow();
    });
  });

  describe("useIsDroppingFiles SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useIsDroppingFiles } = await import("@/hooks/useIsDroppingFiles");
      expect(() => useIsDroppingFiles()).not.toThrow();
    });
  });

  // ============================================
  // Fetch Hook
  // ============================================

  describe("useFetch SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFetch } = await import("@/hooks/useFetch");
      expect(() => useFetch("https://example.com/api")).not.toThrow();
    });
  });

  // ============================================
  // Pure State Hooks
  // ============================================

  describe("useCounter SSR", () => {
    it("should initialize with given value", async () => {
      expect.hasAssertions();
      const { useCounter } = await import("@/hooks/useCounter");
      const result = useCounter(5);
      expect(result.value).toBe(5);
    });
  });

  describe("useToggle SSR", () => {
    it("should initialize with given value", async () => {
      expect.hasAssertions();
      const { useToggle } = await import("@/hooks/useToggle");
      const [value] = useToggle(true);
      expect(value).toBe(true);
    });
  });

  describe("useArrayState SSR", () => {
    it("should initialize with given array", async () => {
      expect.hasAssertions();
      const { useArrayState } = await import("@/hooks/useArrayState");
      const [value] = useArrayState([1, 2, 3]);
      expect(value).toEqual([1, 2, 3]);
    });
  });

  describe("useMapState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMapState } = await import("@/hooks/useMapState");
      expect(() => useMapState({ key: "value" })).not.toThrow();
    });
  });

  describe("useNativeMapState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useNativeMapState } = await import("@/hooks/useNativeMapState");
      expect(() => useNativeMapState()).not.toThrow();
    });
  });

  describe("useQueueState SSR", () => {
    it("should initialize with given array", async () => {
      expect.hasAssertions();
      const { useQueueState } = await import("@/hooks/useQueueState");
      const [value] = useQueueState([1, 2, 3]);
      expect(value).toEqual([1, 2, 3]);
    });
  });

  describe("useStackState SSR", () => {
    it("should initialize with given array", async () => {
      expect.hasAssertions();
      const { useStackState } = await import("@/hooks/useStackState");
      const [value] = useStackState([1, 2, 3]);
      expect(value).toEqual([1, 2, 3]);
    });
  });

  describe("useSetState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSetState } = await import("@/hooks/useSetState");
      expect(() => useSetState(new Set(["value"]))).not.toThrow();
    });
  });

  describe("useFormState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFormState } = await import("@/hooks/useFormState");
      expect(() => useFormState({ initialValues: { name: "test" } })).not.toThrow();
    });
  });

  describe("useInput SSR", () => {
    it("should initialize with given value", async () => {
      expect.hasAssertions();
      const { useInput } = await import("@/hooks/useInput");
      const result = useInput("initial");
      expect(result.value).toBe("initial");
    });
  });

  describe("useCheckboxInputState SSR", () => {
    it("should initialize with given value", async () => {
      expect.hasAssertions();
      const { useCheckboxInputState } = await import("@/hooks/useCheckboxInputState");
      const result = useCheckboxInputState(true);
      expect(result.checked).toBe(true);
    });
  });

  describe("useSelect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSelect } = await import("@/hooks/useSelect");
      expect(() => useSelect([{ value: "a", label: "A" }], 0)).not.toThrow();
    });
  });

  describe("useSelectableList SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSelectableList } = await import("@/hooks/useSelectableList");
      expect(() => useSelectableList([1, 2, 3])).not.toThrow();
    });
  });

  describe("useMultiSelectableList SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMultiSelectableList } = await import("@/hooks/useMultiSelectableList");
      expect(() => useMultiSelectableList([1, 2, 3])).not.toThrow();
    });
  });

  describe("useUndoState SSR", () => {
    it("should initialize with given value", async () => {
      expect.hasAssertions();
      const { useUndoState } = await import("@/hooks/useUndoState");
      const [value] = useUndoState("initial");
      expect(value).toBe("initial");
    });
  });

  describe("useUndoRedoState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useUndoRedoState } = await import("@/hooks/useUndoRedoState");
      expect(() => useUndoRedoState("initial")).not.toThrow();
    });
  });

  describe("useTimeTravelState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useTimeTravelState } = await import("@/hooks/useTimeTravelState");
      expect(() => useTimeTravelState("initial")).not.toThrow();
    });
  });

  describe("usePreviousImmediate SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePreviousImmediate } = await import("@/hooks/usePreviousImmediate");
      expect(() => usePreviousImmediate("value")).not.toThrow();
    });
  });

  describe("usePreviousDifferent SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePreviousDifferent } = await import("@/hooks/usePreviousDifferent");
      expect(() => usePreviousDifferent("value")).not.toThrow();
    });
  });

  // ============================================
  // Timing Hooks
  // ============================================

  describe("useCountdown SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useCountdown } = await import("@/hooks/useCountdown");
      expect(() => useCountdown(new Date(Date.now() + 10000))).not.toThrow();
    });
  });

  describe("useDebounce SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDebounce } = await import("@/hooks/useDebounce");
      expect(() => useDebounce(vi.fn(), 500)).not.toThrow();
    });
  });

  describe("useDebounceFn SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDebounceFn } = await import("@/hooks/useDebounceFn");
      expect(() => useDebounceFn(vi.fn(), 500)).not.toThrow();
    });
  });

  describe("useDebouncedValue SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDebouncedValue } = await import("@/hooks/useDebouncedValue");
      expect(() => useDebouncedValue("value", 500)).not.toThrow();
    });
  });

  describe("useThrottle SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useThrottle } = await import("@/hooks/useThrottle");
      expect(() => useThrottle(vi.fn(), 500)).not.toThrow();
    });
  });

  describe("useIntervalWhen SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useIntervalWhen } = await import("@/hooks/useIntervalWhen");
      expect(() => useIntervalWhen(vi.fn(), 1000)).not.toThrow();
    });
  });

  describe("useTimeoutWhen SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useTimeoutWhen } = await import("@/hooks/useTimeoutWhen");
      expect(() => useTimeoutWhen(vi.fn(), 1000)).not.toThrow();
    });
  });

  // ============================================
  // Animation Hooks
  // ============================================

  describe("useAnimation SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useAnimation } = await import("@/hooks/useAnimation");
      expect(() => useAnimation(vi.fn(), 1000)).not.toThrow();
    });
  });

  describe("useSpring SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSpring } = await import("@/hooks/useSpring");
      expect(() => useSpring(0)).not.toThrow();
    });
  });

  describe("useTween SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useTween } = await import("@/hooks/useTween");
      expect(() => useTween()).not.toThrow();
    });
  });

  describe("useRaf SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useRaf } = await import("@/hooks/useRaf");
      expect(() => useRaf(vi.fn())).not.toThrow();
    });
  });

  // ============================================
  // Effect/Lifecycle Hooks
  // ============================================

  describe("useDidMount SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDidMount } = await import("@/hooks/useDidMount");
      expect(() => useDidMount(vi.fn())).not.toThrow();
    });
  });

  describe("useDidUpdate SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDidUpdate } = await import("@/hooks/useDidUpdate");
      expect(() => useDidUpdate(vi.fn(), [])).not.toThrow();
    });
  });

  describe("useWillUnmount SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useWillUnmount } = await import("@/hooks/useWillUnmount");
      expect(() => useWillUnmount(vi.fn())).not.toThrow();
    });
  });

  describe("useEffectOnceWhen SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useEffectOnceWhen } = await import("@/hooks/useEffectOnceWhen");
      expect(() => useEffectOnceWhen(vi.fn(), true)).not.toThrow();
    });
  });

  describe("useAsyncEffect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useAsyncEffect } = await import("@/hooks/useAsyncEffect");
      expect(() => useAsyncEffect(async () => {}, [])).not.toThrow();
    });
  });

  describe("useDebouncedEffect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDebouncedEffect } = await import("@/hooks/useDebouncedEffect");
      expect(() => useDebouncedEffect(vi.fn(), [], 500)).not.toThrow();
    });
  });

  describe("useDebouncedAsyncEffect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDebouncedAsyncEffect } = await import("@/hooks/useDebouncedAsyncEffect");
      expect(() => useDebouncedAsyncEffect(async () => {}, [], 500)).not.toThrow();
    });
  });

  describe("useDeepCompareEffect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useDeepCompareEffect } = await import("@/hooks/useDeepCompareEffect");
      expect(() => useDeepCompareEffect(vi.fn(), [{ a: 1 }])).not.toThrow();
    });
  });

  describe("useIsomorphicEffect SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useIsomorphicEffect } = await import("@/hooks/useIsomorphicEffect");
      expect(() => useIsomorphicEffect(vi.fn(), [])).not.toThrow();
    });
  });

  // ============================================
  // Ref Hooks
  // ============================================

  describe("useFreshRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFreshRef } = await import("@/hooks/useFreshRef");
      expect(() => useFreshRef("value")).not.toThrow();
    });
  });

  describe("useFreshCallback SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFreshCallback } = await import("@/hooks/useFreshCallback");
      expect(() => useFreshCallback(vi.fn())).not.toThrow();
    });
  });

  describe("useFreshTick SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useFreshTick } = await import("@/hooks/useFreshTick");
      expect(() => useFreshTick(vi.fn())).not.toThrow();
    });
  });

  describe("useForkRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useForkRef } = await import("@/hooks/useForkRef");
      expect(() => useForkRef(null, null)).not.toThrow();
    });
  });

  describe("useMergeRefs SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useMergeRefs } = await import("@/hooks/useMergeRefs");
      expect(() => useMergeRefs(null, null)).not.toThrow();
    });
  });

  describe("useRefElement SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useRefElement } = await import("@/hooks/useRefElement");
      expect(() => useRefElement()).not.toThrow();
    });
  });

  describe("useEventListenerRef SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useEventListenerRef } = await import("@/hooks/useEventListenerRef");
      expect(() => useEventListenerRef("click", vi.fn())).not.toThrow();
    });
  });

  // ============================================
  // Utility Hooks
  // ============================================

  describe("useGetIsMounted SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useGetIsMounted } = await import("@/hooks/useGetIsMounted");
      expect(() => useGetIsMounted()).not.toThrow();
    });
  });

  describe("useSafeSetState SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useSafeSetState } = await import("@/hooks/useSafeSetState");
      expect(() => useSafeSetState("initial")).not.toThrow();
    });
  });

  describe("useRenderCount SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useRenderCount } = await import("@/hooks/useRenderCount");
      expect(() => useRenderCount()).not.toThrow();
    });
  });

  describe("useWhyDidYouUpdate SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useWhyDidYouUpdate } = await import("@/hooks/useWhyDidYouUpdate");
      expect(() => useWhyDidYouUpdate("TestComponent", { prop: "value" })).not.toThrow();
    });
  });

  describe("useLifecycleLogger SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useLifecycleLogger } = await import("@/hooks/useLifecycleLogger");
      expect(() => useLifecycleLogger("TestComponent")).not.toThrow();
    });
  });

  describe("useWarningOnMountInDevelopment SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { useWarningOnMountInDevelopment } = await import("@/hooks/useWarningOnMountInDevelopment");
      expect(() => useWarningOnMountInDevelopment("Test warning")).not.toThrow();
    });
  });

  describe("usePromise SSR", () => {
    it("should not throw in SSR", async () => {
      expect.hasAssertions();
      const { usePromise } = await import("@/hooks/usePromise");
      expect(() => usePromise()).not.toThrow();
    });
  });
});
