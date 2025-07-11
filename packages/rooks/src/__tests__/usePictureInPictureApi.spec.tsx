import { renderHook, act } from "@testing-library/react";
import { usePictureInPictureApi } from "@/hooks/usePictureInPictureApi";
import { RefObject } from "react";

// Mock the Picture-in-Picture API
const mockRequestPictureInPicture = jest.fn();
const mockExitPictureInPicture = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Mock PictureInPictureWindow
const mockPictureInPictureWindow = {
  width: 640,
  height: 360,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  onresize: null,
  dispatchEvent: jest.fn(),
} as unknown as PictureInPictureWindow;

// Mock video element
const mockVideoElement = {
  requestPictureInPicture: mockRequestPictureInPicture,
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  disablePictureInPicture: false,
} as unknown as HTMLVideoElement;

// Mock video ref
const mockVideoRef = {
  current: mockVideoElement,
} as RefObject<HTMLVideoElement>;

const mockVideoRefNull = {
  current: null,
} as RefObject<HTMLVideoElement>;

// Mock document (definitions moved to Object.defineProperty below)

// Override global document properties
Object.defineProperty(document, 'pictureInPictureEnabled', {
  value: true,
  writable: true,
});

Object.defineProperty(document, 'pictureInPictureElement', {
  value: null,
  writable: true,
});

Object.defineProperty(document, 'exitPictureInPicture', {
  value: mockExitPictureInPicture,
  writable: true,
});

  describe("usePictureInPictureApi", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (document as any).pictureInPictureElement = null;
      (document as any).pictureInPictureEnabled = true;
      mockVideoElement.disablePictureInPicture = false;
      mockRequestPictureInPicture.mockResolvedValue(mockPictureInPictureWindow);
      mockExitPictureInPicture.mockResolvedValue(undefined);
    });

  describe("Hook Definition", () => {
    it("should be defined", () => {
      expect(usePictureInPictureApi).toBeDefined();
    });
  });

  describe("Initial State", () => {
    it("should initialize with correct default values", () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      expect(result.current.isPiPActive).toBe(false);
      expect(result.current.isSupported).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.pipWindow).toBe(null);
      expect(typeof result.current.enterPiP).toBe("function");
      expect(typeof result.current.exitPiP).toBe("function");
      expect(typeof result.current.toggle).toBe("function");
    });
  });

  describe("Support Detection", () => {
    it("should detect PiP support when all conditions are met", () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));
      expect(result.current.isSupported).toBe(true);
    });

    it("should detect no support when pictureInPictureEnabled is false", () => {
      (document as any).pictureInPictureEnabled = false;
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));
      expect(result.current.isSupported).toBe(false);
    });

    it("should detect no support when video ref is null", () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRefNull));
      expect(result.current.isSupported).toBe(false);
    });

    it("should detect no support when video element lacks requestPictureInPicture", () => {
      const unsupportedVideo = {
        requestPictureInPicture: undefined,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        disablePictureInPicture: false,
      } as unknown as HTMLVideoElement;

      const unsupportedVideoRef = {
        current: unsupportedVideo,
      } as RefObject<HTMLVideoElement>;

      const { result } = renderHook(() => usePictureInPictureApi(unsupportedVideoRef));
      expect(result.current.isSupported).toBe(false);
    });

    it("should detect no support when disablePictureInPicture is true", () => {
      mockVideoElement.disablePictureInPicture = true;
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));
      expect(result.current.isSupported).toBe(false);
    });

    it("should reactively update support when video element properties change", () => {
      const { result, rerender } = renderHook(() => usePictureInPictureApi(mockVideoRef));
      
      // Initially supported
      expect(result.current.isSupported).toBe(true);
      
      // Change video element property
      act(() => {
        mockVideoElement.disablePictureInPicture = true;
      });
      
      rerender();
      
      // Should now be unsupported
      expect(result.current.isSupported).toBe(false);
    });
  });

  describe("Enter PiP Functionality", () => {
    it("should enter Picture-in-Picture mode successfully", async () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      await act(async () => {
        await result.current.enterPiP();
      });

      expect(mockRequestPictureInPicture).toHaveBeenCalledTimes(1);
      expect(result.current.error).toBe(null);
      
      // pipWindow should be set via event, not directly from the promise
      // (following best practice to wait for browser event)
      expect(result.current.pipWindow).toBe(null);
    });

    it("should set pipWindow via enterpictureinpicture event (best practice)", async () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      // Enter PiP mode
      await act(async () => {
        await result.current.enterPiP();
      });

      // pipWindow should initially be null
      expect(result.current.pipWindow).toBe(null);

      // Simulate the enterpictureinpicture event
      const enterEvent = {
        type: "enterpictureinpicture",
        pictureInPictureWindow: mockPictureInPictureWindow,
      } as PictureInPictureEvent;

      act(() => {
        const enterHandler = mockAddEventListener.mock.calls.find(
          (call) => call[0] === "enterpictureinpicture"
        )[1];
        enterHandler(enterEvent);
      });

      // Now pipWindow should be set
      expect(result.current.pipWindow).toBe(mockPictureInPictureWindow);
    });

    it("should handle errors when entering PiP", async () => {
      const testError = new Error("Not supported");
      mockRequestPictureInPicture.mockRejectedValue(testError);

      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      await act(async () => {
        await result.current.enterPiP();
      });

      expect(result.current.error).toBe(testError);
      expect(result.current.pipWindow).toBe(null);
    });

    it("should not enter PiP when video ref is null", async () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRefNull));

      await act(async () => {
        await result.current.enterPiP();
      });

      expect(mockRequestPictureInPicture).not.toHaveBeenCalled();
      expect(result.current.error).toBe(null);
    });

    it("should not enter PiP when not supported", async () => {
      (document as any).pictureInPictureEnabled = false;
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      await act(async () => {
        await result.current.enterPiP();
      });

      expect(mockRequestPictureInPicture).not.toHaveBeenCalled();
      expect(result.current.error).toBe(null);
    });

    it("should clear previous error when entering PiP successfully", async () => {
      const testError = new Error("Previous error");
      mockRequestPictureInPicture.mockRejectedValueOnce(testError);

      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      // First attempt with error
      await act(async () => {
        await result.current.enterPiP();
      });

      expect(result.current.error).toBe(testError);

      // Second attempt successful
      mockRequestPictureInPicture.mockResolvedValueOnce(mockPictureInPictureWindow);

      await act(async () => {
        await result.current.enterPiP();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe("Exit PiP Functionality", () => {
    it("should exit Picture-in-Picture mode successfully", async () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      // Mock that element is in PiP mode
      (document as any).pictureInPictureElement = mockVideoElement;

      await act(async () => {
        await result.current.exitPiP();
      });

      expect(mockExitPictureInPicture).toHaveBeenCalledTimes(1);
      expect(result.current.error).toBe(null);
      
      // pipWindow should be cleared via event, not directly
      // (following best practice to wait for browser event)
    });

    it("should clear pipWindow via leavepictureinpicture event (best practice)", async () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      // First set pipWindow via enter event
      const enterEvent = {
        type: "enterpictureinpicture",
        pictureInPictureWindow: mockPictureInPictureWindow,
      } as PictureInPictureEvent;

      act(() => {
        const enterHandler = mockAddEventListener.mock.calls.find(
          (call) => call[0] === "enterpictureinpicture"
        )[1];
        enterHandler(enterEvent);
      });

      expect(result.current.pipWindow).toBe(mockPictureInPictureWindow);

      // Mock that element is in PiP mode
      (document as any).pictureInPictureElement = mockVideoElement;

      // Exit PiP mode
      await act(async () => {
        await result.current.exitPiP();
      });

      // pipWindow should still be set (not cleared directly)
      expect(result.current.pipWindow).toBe(mockPictureInPictureWindow);

      // Now simulate the leavepictureinpicture event
      const leaveEvent = {
        type: "leavepictureinpicture",
      } as Event;

      act(() => {
        const leaveHandler = mockAddEventListener.mock.calls.find(
          (call) => call[0] === "leavepictureinpicture"
        )[1];
        leaveHandler(leaveEvent);
      });

      // Now pipWindow should be cleared
      expect(result.current.pipWindow).toBe(null);
    });

    it("should handle errors when exiting PiP", async () => {
      const testError = new Error("Exit failed");
      mockExitPictureInPicture.mockRejectedValue(testError);

      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      // Mock that element is in PiP mode
      (document as any).pictureInPictureElement = mockVideoElement;

      await act(async () => {
        await result.current.exitPiP();
      });

      expect(result.current.error).toBe(testError);
    });

    it("should not exit PiP when no element is in PiP mode", async () => {
      (document as any).pictureInPictureElement = null;
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      await act(async () => {
        await result.current.exitPiP();
      });

      expect(mockExitPictureInPicture).not.toHaveBeenCalled();
      expect(result.current.error).toBe(null);
    });

    it("should clear previous error when exiting PiP successfully", async () => {
      const testError = new Error("Previous error");
      mockExitPictureInPicture.mockRejectedValueOnce(testError);

      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      // Mock that element is in PiP mode
      (document as any).pictureInPictureElement = mockVideoElement;

      // First attempt with error
      await act(async () => {
        await result.current.exitPiP();
      });

      expect(result.current.error).toBe(testError);

      // Second attempt successful
      mockExitPictureInPicture.mockResolvedValueOnce(undefined);

      await act(async () => {
        await result.current.exitPiP();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe("Toggle Functionality", () => {
    it("should toggle from inactive to active (enter PiP)", async () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      await act(async () => {
        await result.current.toggle();
      });

      expect(mockRequestPictureInPicture).toHaveBeenCalledTimes(1);
      expect(mockExitPictureInPicture).not.toHaveBeenCalled();
    });

    it("should toggle from active to inactive (exit PiP)", async () => {
      // Mock that element is already in PiP mode
      (document as any).pictureInPictureElement = mockVideoElement;

      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      await act(async () => {
        await result.current.toggle();
      });

      expect(mockExitPictureInPicture).toHaveBeenCalledTimes(1);
      expect(mockRequestPictureInPicture).not.toHaveBeenCalled();
    });

    it("should handle errors during toggle", async () => {
      const testError = new Error("Toggle failed");
      mockRequestPictureInPicture.mockRejectedValue(testError);

      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      await act(async () => {
        await result.current.toggle();
      });

      expect(result.current.error).toBe(testError);
    });
  });

  describe("PiP State Detection", () => {
    it("should detect when current video is in PiP mode", () => {
      // Mock that this video is in PiP mode
      (document as any).pictureInPictureElement = mockVideoElement;
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));
      expect(result.current.isPiPActive).toBe(true);
    });

    it("should detect when current video is not in PiP mode", () => {
      // Mock that no video is in PiP mode
      (document as any).pictureInPictureElement = null;
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));
      expect(result.current.isPiPActive).toBe(false);
    });

    it("should detect when a different video is in PiP mode", () => {
      // Mock that a different video is in PiP mode
      const differentVideoElement = document.createElement('video');
      (document as any).pictureInPictureElement = differentVideoElement;
      
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));
      expect(result.current.isPiPActive).toBe(false);
    });
  });

  describe("Event Listeners", () => {
    it("should set up event listeners on mount", () => {
      renderHook(() => usePictureInPictureApi(mockVideoRef));

      expect(mockAddEventListener).toHaveBeenCalledWith(
        "enterpictureinpicture",
        expect.any(Function)
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        "leavepictureinpicture",
        expect.any(Function)
      );
    });

    it("should clean up event listeners on unmount", () => {
      const { unmount } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "enterpictureinpicture",
        expect.any(Function)
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "leavepictureinpicture",
        expect.any(Function)
      );
    });

    it("should handle enterpictureinpicture event", () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      // Create a proper PictureInPictureEvent
      const enterEvent = {
        type: "enterpictureinpicture",
        pictureInPictureWindow: mockPictureInPictureWindow,
      } as PictureInPictureEvent;

      act(() => {
        const enterHandler = mockAddEventListener.mock.calls.find(
          (call) => call[0] === "enterpictureinpicture"
        )[1];
        enterHandler(enterEvent);
      });

      expect(result.current.isPiPActive).toBe(true);
      expect(result.current.pipWindow).toBe(mockPictureInPictureWindow);
    });

    it("should handle leavepictureinpicture event", () => {
      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      // First simulate entering PiP
      const enterEvent = {
        type: "enterpictureinpicture",
        pictureInPictureWindow: mockPictureInPictureWindow,
      } as PictureInPictureEvent;

      act(() => {
        const enterHandler = mockAddEventListener.mock.calls.find(
          (call) => call[0] === "enterpictureinpicture"
        )[1];
        enterHandler(enterEvent);
      });

      // Then simulate leaving PiP
      const leaveEvent = {
        type: "leavepictureinpicture",
      } as Event;

      act(() => {
        const leaveHandler = mockAddEventListener.mock.calls.find(
          (call) => call[0] === "leavepictureinpicture"
        )[1];
        leaveHandler(leaveEvent);
      });

      expect(result.current.isPiPActive).toBe(false);
      expect(result.current.pipWindow).toBe(null);
    });

    it("should not set up event listeners when video ref is null", () => {
      renderHook(() => usePictureInPictureApi(mockVideoRefNull));

      expect(mockAddEventListener).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle non-Error objects as errors", async () => {
      const nonErrorObject = "String error";
      mockRequestPictureInPicture.mockRejectedValue(nonErrorObject);

      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      await act(async () => {
        await result.current.enterPiP();
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe("String error");
    });

    it("should maintain error state until next successful operation", async () => {
      const testError = new Error("Test error");
      mockRequestPictureInPicture.mockRejectedValueOnce(testError);

      const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

      await act(async () => {
        await result.current.enterPiP();
      });

      expect(result.current.error).toBe(testError);

      // Error should persist
      expect(result.current.error).toBe(testError);
    });
  });

  describe("Video Element Changes", () => {
    it("should handle video element changing during hook lifetime", () => {
      const newVideoElement = {
        requestPictureInPicture: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        disablePictureInPicture: false,
      } as unknown as HTMLVideoElement;

      const mutableVideoRef = {
        current: mockVideoElement,
      } as RefObject<HTMLVideoElement>;

      const { result, rerender } = renderHook(() => usePictureInPictureApi(mutableVideoRef));

      // Initially uses first video element
      expect(result.current.isSupported).toBe(true);

      // Change video element
      act(() => {
        mutableVideoRef.current = newVideoElement;
      });

      rerender();

      // Should work with new video element
      expect(result.current.isSupported).toBe(true);
    });

    it("should clean up event listeners when video element changes", () => {
      const newVideoElement = {
        requestPictureInPicture: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        disablePictureInPicture: false,
      } as unknown as HTMLVideoElement;

      const mutableVideoRef = {
        current: mockVideoElement,
      } as RefObject<HTMLVideoElement>;

      const { rerender } = renderHook(() => usePictureInPictureApi(mutableVideoRef));

      // Change video element
      act(() => {
        mutableVideoRef.current = newVideoElement;
      });

      rerender();

      // Should have cleaned up listeners from old element
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "enterpictureinpicture",
        expect.any(Function)
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "leavepictureinpicture",
        expect.any(Function)
      );

      // Should have added listeners to new element
      expect(newVideoElement.addEventListener).toHaveBeenCalledWith(
        "enterpictureinpicture",
        expect.any(Function)
      );
      expect(newVideoElement.addEventListener).toHaveBeenCalledWith(
        "leavepictureinpicture",
        expect.any(Function)
      );
    });

    it("should handle video element changing to null", () => {
      const mutableVideoRef = {
        current: mockVideoElement,
      } as RefObject<HTMLVideoElement>;

      const { result, rerender } = renderHook(() => usePictureInPictureApi(mutableVideoRef));

      // Initially supported
      expect(result.current.isSupported).toBe(true);

      // Change to null
      act(() => {
        mutableVideoRef.current = null;
      });

      rerender();

      // Should be unsupported
      expect(result.current.isSupported).toBe(false);
    });
  });
});