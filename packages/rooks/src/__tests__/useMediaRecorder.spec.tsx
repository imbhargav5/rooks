import { vi } from "vitest";
/**
 */
import { renderHook, act } from "@testing-library/react";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";

describe("useMediaRecorder", () => {
  let mockMediaRecorder: any;
  let mockMediaRecorderConstructor: vi.Mock;
  let mockStream: MediaStream;

  beforeEach(() => {
    mockMediaRecorder = {
      state: "inactive",
      start: vi.fn(),
      stop: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      ondataavailable: null,
      onstop: null,
      onerror: null,
    };

    mockMediaRecorderConstructor = vi.fn(() => mockMediaRecorder);

    Object.defineProperty(window, "MediaRecorder", {
      writable: true,
      configurable: true,
      value: mockMediaRecorderConstructor,
    });

    mockStream = {
      getTracks: vi.fn(() => []),
    } as unknown as MediaStream;

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useMediaRecorder).toBeDefined();
  });

  it("should return initial state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    expect(result.current.recordingState).toBe("idle");
    expect(result.current.data).toBe(null);
    expect(result.current.dataUrl).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.isSupported).toBe(true);
    expect(typeof result.current.startRecording).toBe("function");
    expect(typeof result.current.stopRecording).toBe("function");
    expect(typeof result.current.pauseRecording).toBe("function");
    expect(typeof result.current.resumeRecording).toBe("function");
  });

  it("should detect when MediaRecorder is not supported", () => {
    expect.hasAssertions();
    const originalMediaRecorder = window.MediaRecorder;
    // @ts-ignore
    delete window.MediaRecorder;

    const { result } = renderHook(() => useMediaRecorder(mockStream));

    expect(result.current.isSupported).toBe(false);

    // Restore
    window.MediaRecorder = originalMediaRecorder;
  });

  it("should create MediaRecorder with stream", () => {
    expect.hasAssertions();
    renderHook(() => useMediaRecorder(mockStream, { mimeType: "audio/webm" }));

    expect(mockMediaRecorderConstructor).toHaveBeenCalledWith(mockStream, {
      mimeType: "audio/webm",
    });
  });

  it("should start recording", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
    });

    expect(mockMediaRecorder.start).toHaveBeenCalled();
    expect(result.current.recordingState).toBe("recording");
  });

  it("should stop recording and create blob", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    // Start recording
    act(() => {
      result.current.startRecording();
    });

    // Simulate data available
    act(() => {
      const blob = new Blob(["data"], { type: "audio/webm" });
      mockMediaRecorder.ondataavailable({ data: blob });
    });

    // Stop recording
    act(() => {
      result.current.stopRecording();
      mockMediaRecorder.onstop();
    });

    expect(mockMediaRecorder.stop).toHaveBeenCalled();
    expect(result.current.recordingState).toBe("stopped");
    expect(result.current.data).toBeInstanceOf(Blob);
    expect(result.current.dataUrl).toBe("blob:mock-url");
  });

  it("should pause recording", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
    });

    act(() => {
      result.current.pauseRecording();
    });

    expect(mockMediaRecorder.pause).toHaveBeenCalled();
    expect(result.current.recordingState).toBe("paused");
  });

  it("should resume recording", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
    });

    act(() => {
      result.current.pauseRecording();
    });

    act(() => {
      result.current.resumeRecording();
    });

    expect(mockMediaRecorder.resume).toHaveBeenCalled();
    expect(result.current.recordingState).toBe("recording");
  });

  it("should not pause if not recording", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.pauseRecording();
    });

    expect(mockMediaRecorder.pause).not.toHaveBeenCalled();
  });

  it("should not resume if not paused", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.resumeRecording();
    });

    expect(mockMediaRecorder.resume).not.toHaveBeenCalled();
  });

  it("should handle recording errors", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
    });

    act(() => {
      mockMediaRecorder.onerror({
        error: { message: "Recording error" },
      });
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain("Recording error");
    expect(result.current.recordingState).toBe("idle");
  });

  it("should handle error without message", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      mockMediaRecorder.onerror({});
    });

    expect(result.current.error?.message).toContain("Unknown error");
  });

  it("should handle start recording error", () => {
    expect.hasAssertions();
    mockMediaRecorder.start.mockImplementation(() => {
      throw new Error("Start error");
    });

    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Start error");
  });

  it("should handle stop recording error", () => {
    expect.hasAssertions();
    mockMediaRecorder.stop.mockImplementation(() => {
      throw new Error("Stop error");
    });

    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Stop error");
  });

  it("should handle pause recording error", () => {
    expect.hasAssertions();
    mockMediaRecorder.pause.mockImplementation(() => {
      throw new Error("Pause error");
    });

    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
    });

    act(() => {
      result.current.pauseRecording();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Pause error");
  });

  it("should handle resume recording error", () => {
    expect.hasAssertions();
    mockMediaRecorder.resume.mockImplementation(() => {
      throw new Error("Resume error");
    });

    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
      result.current.pauseRecording();
    });

    mockMediaRecorder.resume.mockImplementation(() => {
      throw new Error("Resume error");
    });

    act(() => {
      result.current.resumeRecording();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Resume error");
  });

  it("should clear data when starting new recording", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    // First recording
    act(() => {
      result.current.startRecording();
      mockMediaRecorder.ondataavailable({ data: new Blob(["data1"]) });
      result.current.stopRecording();
      mockMediaRecorder.onstop();
    });

    expect(result.current.data).not.toBe(null);

    // Start new recording
    act(() => {
      result.current.startRecording();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.dataUrl).toBe(null);
  });

  it("should handle null stream", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(null));

    expect(result.current.recordingState).toBe("idle");
    expect(mockMediaRecorderConstructor).not.toHaveBeenCalled();
  });

  it("should stop recorder on unmount", () => {
    expect.hasAssertions();
    mockMediaRecorder.state = "recording";
    const { unmount } = renderHook(() => useMediaRecorder(mockStream));

    unmount();

    expect(mockMediaRecorder.stop).toHaveBeenCalled();
  });

  it("should revoke data URL on unmount", () => {
    expect.hasAssertions();
    const { result, unmount } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
      mockMediaRecorder.ondataavailable({ data: new Blob(["data"]) });
      result.current.stopRecording();
      mockMediaRecorder.onstop();
    });

    const dataUrl = result.current.dataUrl;

    unmount();

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(dataUrl);
  });

  it("should not start recording without support", () => {
    expect.hasAssertions();
    const originalMediaRecorder = window.MediaRecorder;
    // @ts-ignore
    delete window.MediaRecorder;

    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
    });

    expect(result.current.error?.message).toBe(
      "MediaRecorder is not supported"
    );

    // Restore
    window.MediaRecorder = originalMediaRecorder;
  });

  it("should handle MediaRecorder creation error", () => {
    expect.hasAssertions();
    mockMediaRecorderConstructor.mockImplementation(() => {
      throw new Error("Creation error");
    });

    const { result } = renderHook(() => useMediaRecorder(mockStream));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Creation error");
  });

  it("should only collect data chunks with size > 0", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMediaRecorder(mockStream));

    act(() => {
      result.current.startRecording();
      mockMediaRecorder.ondataavailable({ data: new Blob([]) }); // Empty blob
      mockMediaRecorder.ondataavailable({ data: new Blob(["data"]) }); // Valid blob
      result.current.stopRecording();
      mockMediaRecorder.onstop();
    });

    expect(result.current.data).toBeInstanceOf(Blob);
  });
});
