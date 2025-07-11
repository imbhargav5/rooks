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
};

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

// Mock document
const mockDocument = {
  pictureInPictureEnabled: true,
  pictureInPictureElement: null,
  exitPictureInPicture: mockExitPictureInPicture,
};

// Override global document
Object.defineProperty(window, 'document', {
  value: mockDocument,
  writable: true,
});

describe("usePictureInPictureApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDocument.pictureInPictureElement = null;
    mockDocument.pictureInPictureEnabled = true;
    mockRequestPictureInPicture.mockResolvedValue(mockPictureInPictureWindow);
    mockExitPictureInPicture.mockResolvedValue(undefined);
  });

  it("should be defined", () => {
    expect(usePictureInPictureApi).toBeDefined();
  });

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

  it("should detect PiP support correctly", () => {
    const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));
    expect(result.current.isSupported).toBe(true);

    // Test unsupported case
    mockDocument.pictureInPictureEnabled = false;
    const { result: resultUnsupported } = renderHook(() => usePictureInPictureApi(mockVideoRef));
    expect(resultUnsupported.current.isSupported).toBe(false);
  });

  it("should handle null video ref", () => {
    const { result } = renderHook(() => usePictureInPictureApi(mockVideoRefNull));
    expect(result.current.isSupported).toBe(false);
  });

  it("should enter Picture-in-Picture mode successfully", async () => {
    const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

    await act(async () => {
      await result.current.enterPiP();
    });

    expect(mockRequestPictureInPicture).toHaveBeenCalledTimes(1);
    expect(result.current.pipWindow).toBe(mockPictureInPictureWindow);
    expect(result.current.error).toBe(null);
  });

  it("should exit Picture-in-Picture mode successfully", async () => {
    const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

    // First enter PiP mode
    await act(async () => {
      await result.current.enterPiP();
    });

    // Mock that element is now in PiP mode
    mockDocument.pictureInPictureElement = mockVideoElement;

    await act(async () => {
      await result.current.exitPiP();
    });

    expect(mockExitPictureInPicture).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBe(null);
  });

  it("should toggle Picture-in-Picture mode", async () => {
    const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

    // Toggle to enter PiP
    await act(async () => {
      await result.current.toggle();
    });

    expect(mockRequestPictureInPicture).toHaveBeenCalledTimes(1);

    // Mock that element is now in PiP mode
    mockDocument.pictureInPictureElement = mockVideoElement;

    // Toggle to exit PiP
    await act(async () => {
      await result.current.toggle();
    });

    expect(mockExitPictureInPicture).toHaveBeenCalledTimes(1);
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

  it("should handle errors when exiting PiP", async () => {
    const testError = new Error("Exit failed");
    mockExitPictureInPicture.mockRejectedValue(testError);

    const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

    // First enter PiP mode
    await act(async () => {
      await result.current.enterPiP();
    });

    // Mock that element is now in PiP mode
    mockDocument.pictureInPictureElement = mockVideoElement;

    await act(async () => {
      await result.current.exitPiP();
    });

    expect(result.current.error).toBe(testError);
  });

  it("should not enter PiP when video ref is null", async () => {
    const { result } = renderHook(() => usePictureInPictureApi(mockVideoRefNull));

    await act(async () => {
      await result.current.enterPiP();
    });

    expect(mockRequestPictureInPicture).not.toHaveBeenCalled();
  });

  it("should not enter PiP when not supported", async () => {
    mockDocument.pictureInPictureEnabled = false;
    const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

    await act(async () => {
      await result.current.enterPiP();
    });

    expect(mockRequestPictureInPicture).not.toHaveBeenCalled();
  });

  it("should detect active PiP state correctly", () => {
    // Initially not active
    const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));
    expect(result.current.isPiPActive).toBe(false);

    // Mock that this video is in PiP mode
    mockDocument.pictureInPictureElement = mockVideoElement;
    const { result: resultActive } = renderHook(() => usePictureInPictureApi(mockVideoRef));
    expect(resultActive.current.isPiPActive).toBe(true);
  });

  it("should handle video element without PiP support", () => {
    const unsupportedVideo = {
      requestPictureInPicture: undefined,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    } as unknown as HTMLVideoElement;

    const unsupportedVideoRef = {
      current: unsupportedVideo,
    } as RefObject<HTMLVideoElement>;

    const { result } = renderHook(() => usePictureInPictureApi(unsupportedVideoRef));
    expect(result.current.isSupported).toBe(false);
  });

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

    // Simulate enterpictureinpicture event
    const enterEvent = new CustomEvent("enterpictureinpicture", {
      detail: { pictureInPictureWindow: mockPictureInPictureWindow },
    });

    act(() => {
      const enterHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === "enterpictureinpicture"
      )[1];
      enterHandler(enterEvent);
    });

    expect(result.current.isPiPActive).toBe(true);
  });

  it("should handle leavepictureinpicture event", () => {
    const { result } = renderHook(() => usePictureInPictureApi(mockVideoRef));

    // First simulate entering PiP
    const enterEvent = new CustomEvent("enterpictureinpicture", {
      detail: { pictureInPictureWindow: mockPictureInPictureWindow },
    });

    act(() => {
      const enterHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === "enterpictureinpicture"
      )[1];
      enterHandler(enterEvent);
    });

    // Then simulate leaving PiP
    const leaveEvent = new CustomEvent("leavepictureinpicture");

    act(() => {
      const leaveHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === "leavepictureinpicture"
      )[1];
      leaveHandler(leaveEvent);
    });

    expect(result.current.isPiPActive).toBe(false);
    expect(result.current.pipWindow).toBe(null);
  });

  it("should clear error when entering PiP successfully after previous error", async () => {
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

  it("should handle disabled PiP on video element", () => {
    const disabledVideoElement = {
      ...mockVideoElement,
      disablePictureInPicture: true,
    } as HTMLVideoElement;

    const disabledVideoRef = {
      current: disabledVideoElement,
    } as RefObject<HTMLVideoElement>;

    const { result } = renderHook(() => usePictureInPictureApi(disabledVideoRef));
    expect(result.current.isSupported).toBe(false);
  });
});