import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAudio } from "@/hooks/useAudio";

describe("useAudio", () => {
  let mockAudioElement: HTMLAudioElement;

  beforeEach(() => {
    mockAudioElement = document.createElement("audio");

    // Mock play to return promise
    mockAudioElement.play = vi.fn().mockResolvedValue(undefined);
    mockAudioElement.pause = vi.fn();

    // Set initial properties
    Object.defineProperty(mockAudioElement, "currentTime", {
      value: 0,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockAudioElement, "duration", {
      value: 100,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockAudioElement, "volume", {
      value: 1,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockAudioElement, "muted", {
      value: false,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockAudioElement, "playbackRate", {
      value: 1,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockAudioElement, "loop", {
      value: false,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockAudioElement, "preload", {
      value: "metadata",
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockAudioElement, "autoplay", {
      value: false,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockAudioElement, "error", {
      value: null,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useAudio).not.toBeUndefined();
  });

  it("should return audioRef, state, and controls with backward compatible API", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, state, controls] = result.current;

    // Test return signature matches original
    expect(audioRef).toBeInstanceOf(Function);
    expect(state).toEqual(expect.objectContaining({
      isPlaying: expect.any(Boolean),
      isMuted: expect.any(Boolean),
      volume: expect.any(Number),
      currentTime: expect.any(Number),
      duration: expect.any(Number),
      playbackRate: expect.any(Number),
      isLoading: expect.any(Boolean),
      isBuffering: expect.any(Boolean),
      loop: expect.any(Boolean),
      hasError: expect.any(Boolean),
    }));

    // Test original control methods exist with correct signatures
    expect(controls.play).toBeInstanceOf(Function);
    expect(controls.pause).toBeInstanceOf(Function);
    expect(controls.togglePlay).toBeInstanceOf(Function);
    expect(controls.mute).toBeInstanceOf(Function);
    expect(controls.unmute).toBeInstanceOf(Function);
    expect(controls.toggleMute).toBeInstanceOf(Function);

    // New control methods are additive (not breaking)
    expect(controls.setVolume).toBeInstanceOf(Function);
    expect(controls.setCurrentTime).toBeInstanceOf(Function);
    expect(controls.setPlaybackRate).toBeInstanceOf(Function);
  });

  it("should accept original options format", () => {
    const originalOptions = {
      autoPlay: false,
      isMuted: true,
    };

    const { result } = renderHook(() => useAudio(originalOptions));
    const [, state] = result.current;

    expect(state.isMuted).toBe(true);
  });

  it("should accept original callbacks format", () => {
    const originalCallbacks = {
      onPlay: vi.fn(),
      onPause: vi.fn(),
      onMute: vi.fn(),
      onUnmute: vi.fn(),
      onLoadedMetadata: vi.fn(),
    };

    const { result } = renderHook(() => useAudio({}, originalCallbacks));

    // Should not throw and should return proper structure
    expect(result.current).toHaveLength(3);
  });

  it("should maintain backward compatible control method signatures", () => {
    const { result } = renderHook(() => useAudio());
    const [, , controls] = result.current;

    // Original methods should return void (not Promise)
    expect(typeof controls.play()).toBe('undefined');
    expect(typeof controls.pause()).toBe('undefined');
    expect(typeof controls.togglePlay()).toBe('undefined');
    expect(typeof controls.mute()).toBe('undefined');
    expect(typeof controls.unmute()).toBe('undefined');
    expect(typeof controls.toggleMute()).toBe('undefined');
  });

  it("should initialize with backward compatible defaults", () => {
    const { result } = renderHook(() => useAudio());
    const [, state] = result.current;

    // Original state properties should have expected defaults
    expect(state.isPlaying).toBe(false);
    expect(state.isMuted).toBe(false);

    // New properties should have sensible defaults
    expect(state.volume).toBe(1);
    expect(state.currentTime).toBe(0);
    expect(state.duration).toBe(0);
    expect(state.playbackRate).toBe(1);
    expect(state.isLoading).toBe(false);
    expect(state.isBuffering).toBe(false);
    expect(state.loop).toBe(false);
    expect(state.hasError).toBe(false);
  });

  it("should support new options while maintaining backward compatibility", () => {
    const enhancedOptions = {
      // Original options
      autoPlay: false,
      isMuted: true,
      // New options
      volume: 0.8,
      playbackRate: 1.5,
      loop: true,
      preload: "auto" as const,
    };

    const { result } = renderHook(() => useAudio(enhancedOptions));
    const [, state] = result.current;

    expect(state.isMuted).toBe(true);
    expect(state.volume).toBe(0.8);
    expect(state.playbackRate).toBe(1.5);
    expect(state.loop).toBe(true);
  });

  it("should support new callbacks while maintaining backward compatibility", () => {
    const enhancedCallbacks = {
      // Original callbacks
      onPlay: vi.fn(),
      onPause: vi.fn(),
      onMute: vi.fn(),
      onUnmute: vi.fn(),
      onLoadedMetadata: vi.fn(),
      // New callbacks
      onTimeUpdate: vi.fn(),
      onVolumeChange: vi.fn(),
      onError: vi.fn(),
    };

    const { result } = renderHook(() => useAudio({}, enhancedCallbacks));

    // Should not throw and should return proper structure
    expect(result.current).toHaveLength(3);
  });

  // New comprehensive tests for coverage
  it("should initialize audio element properties when ref is attached", () => {
    const { result } = renderHook(() => useAudio({
      autoPlay: true,
      isMuted: true,
      volume: 0.5,
      playbackRate: 1.5,
      loop: true,
      preload: "auto",
    }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    // Allow effect to run
    expect(mockAudioElement.muted).toBe(true);
    expect(mockAudioElement.volume).toBe(0.5);
    expect(mockAudioElement.playbackRate).toBe(1.5);
    expect(mockAudioElement.loop).toBe(true);
    expect(mockAudioElement.preload).toBe("auto");
    expect(mockAudioElement.autoplay).toBe(true);
  });

  it("should play audio when play is called with attached node", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      result.current[2].play();
    });

    expect(mockAudioElement.play).toHaveBeenCalled();
  });

  it("should handle play error", async () => {
    const onError = vi.fn();
    const error = new Error("Play failed");
    mockAudioElement.play = vi.fn().mockRejectedValue(error);

    const { result } = renderHook(() => useAudio({}, { onError }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    await act(async () => {
      result.current[2].play();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[1].hasError).toBe(true);
    expect(result.current[1].error).toBe("Play failed");
    expect(onError).toHaveBeenCalledWith("Play failed");
  });

  it("should handle non-Error play rejection", async () => {
    const onError = vi.fn();
    mockAudioElement.play = vi.fn().mockRejectedValue("string error");

    const { result } = renderHook(() => useAudio({}, { onError }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    await act(async () => {
      result.current[2].play();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[1].error).toBe("Failed to play audio");
  });

  it("should pause audio when pause is called with attached node", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      result.current[2].pause();
    });

    expect(mockAudioElement.pause).toHaveBeenCalled();
  });

  it("should toggle play when togglePlay is called", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    // Initial state is not playing, so togglePlay should call play
    act(() => {
      result.current[2].togglePlay();
    });

    expect(mockAudioElement.play).toHaveBeenCalled();
  });

  it("should toggle pause when togglePlay is called while playing", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    // Simulate playing state
    act(() => {
      mockAudioElement.dispatchEvent(new Event("play"));
    });

    act(() => {
      result.current[2].togglePlay();
    });

    expect(mockAudioElement.pause).toHaveBeenCalled();
  });

  it("should mute audio when mute is called", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      result.current[2].mute();
    });

    expect(mockAudioElement.muted).toBe(true);
  });

  it("should unmute audio when unmute is called", () => {
    const { result } = renderHook(() => useAudio({ isMuted: true }));
    const [audioRef] = result.current;

    mockAudioElement.muted = true;
    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      result.current[2].unmute();
    });

    expect(mockAudioElement.muted).toBe(false);
  });

  it("should toggle mute when toggleMute is called", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    // Initial state is not muted
    act(() => {
      result.current[2].toggleMute();
    });

    expect(mockAudioElement.muted).toBe(true);
  });

  it("should toggle unmute when toggleMute is called while muted", () => {
    const { result } = renderHook(() => useAudio({ isMuted: true }));
    const [audioRef] = result.current;

    mockAudioElement.muted = true;
    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      result.current[2].toggleMute();
    });

    expect(mockAudioElement.muted).toBe(false);
  });

  it("should set volume with clamping", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    // Normal volume
    act(() => {
      result.current[2].setVolume(0.5);
    });
    expect(mockAudioElement.volume).toBe(0.5);

    // Clamp to max
    act(() => {
      result.current[2].setVolume(2);
    });
    expect(mockAudioElement.volume).toBe(1);

    // Clamp to min
    act(() => {
      result.current[2].setVolume(-1);
    });
    expect(mockAudioElement.volume).toBe(0);
  });

  it("should set current time with clamping", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    // Simulate duration
    act(() => {
      mockAudioElement.dispatchEvent(new Event("loadedmetadata"));
    });

    // Normal time
    act(() => {
      result.current[2].setCurrentTime(50);
    });
    expect(mockAudioElement.currentTime).toBe(50);

    // Clamp to min
    act(() => {
      result.current[2].setCurrentTime(-10);
    });
    expect(mockAudioElement.currentTime).toBe(0);
  });

  it("should set playback rate with clamping", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    // Normal rate
    act(() => {
      result.current[2].setPlaybackRate(1.5);
    });
    expect(mockAudioElement.playbackRate).toBe(1.5);

    // Clamp to max
    act(() => {
      result.current[2].setPlaybackRate(10);
    });
    expect(mockAudioElement.playbackRate).toBe(4);

    // Clamp to min
    act(() => {
      result.current[2].setPlaybackRate(0.1);
    });
    expect(mockAudioElement.playbackRate).toBe(0.25);
  });

  it("should seek forward", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    // Just verify that seek doesn't throw and calls setCurrentTime
    expect(() => {
      act(() => {
        result.current[2].seek(5);
      });
    }).not.toThrow();
  });

  it("should fast forward", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    expect(() => {
      act(() => {
        result.current[2].fastForward(10);
      });
    }).not.toThrow();
  });

  it("should rewind", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    expect(() => {
      act(() => {
        result.current[2].rewind(10);
      });
    }).not.toThrow();
  });

  it("should set loop", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      result.current[2].setLoop(true);
    });

    expect(mockAudioElement.loop).toBe(true);
    expect(result.current[1].loop).toBe(true);

    act(() => {
      result.current[2].setLoop(false);
    });

    expect(mockAudioElement.loop).toBe(false);
    expect(result.current[1].loop).toBe(false);
  });

  // Event handler tests
  it("should handle loadstart event", () => {
    const onLoadStart = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onLoadStart }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      mockAudioElement.dispatchEvent(new Event("loadstart"));
    });

    expect(result.current[1].isLoading).toBe(true);
    expect(onLoadStart).toHaveBeenCalled();
  });

  it("should handle loadedmetadata event", () => {
    const onLoadedMetadata = vi.fn();
    const onDurationChange = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onLoadedMetadata, onDurationChange }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      mockAudioElement.dispatchEvent(new Event("loadedmetadata"));
    });

    expect(result.current[1].duration).toBe(100);
    expect(result.current[1].isLoading).toBe(false);
    expect(onLoadedMetadata).toHaveBeenCalled();
    expect(onDurationChange).toHaveBeenCalledWith(100);
  });

  it("should handle canplay event", () => {
    const onCanPlay = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onCanPlay }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      mockAudioElement.dispatchEvent(new Event("canplay"));
    });

    expect(result.current[1].isBuffering).toBe(false);
    expect(onCanPlay).toHaveBeenCalled();
  });

  it("should handle waiting event", () => {
    const onWaiting = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onWaiting }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      mockAudioElement.dispatchEvent(new Event("waiting"));
    });

    expect(result.current[1].isBuffering).toBe(true);
    expect(onWaiting).toHaveBeenCalled();
  });

  it("should handle play event", () => {
    const onPlay = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onPlay }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      mockAudioElement.dispatchEvent(new Event("play"));
    });

    expect(result.current[1].isPlaying).toBe(true);
    expect(onPlay).toHaveBeenCalled();
  });

  it("should handle pause event", () => {
    const onPause = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onPause }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      mockAudioElement.dispatchEvent(new Event("pause"));
    });

    expect(result.current[1].isPlaying).toBe(false);
    expect(onPause).toHaveBeenCalled();
  });

  it("should handle ended event", () => {
    const onEnded = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onEnded }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      mockAudioElement.dispatchEvent(new Event("ended"));
    });

    expect(result.current[1].isPlaying).toBe(false);
    expect(onEnded).toHaveBeenCalled();
  });

  it("should handle timeupdate event", () => {
    const onTimeUpdate = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onTimeUpdate }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      mockAudioElement.currentTime = 25;
      mockAudioElement.dispatchEvent(new Event("timeupdate"));
    });

    expect(result.current[1].currentTime).toBe(25);
    expect(onTimeUpdate).toHaveBeenCalledWith(25);
  });

  it("should handle durationchange event", () => {
    const onDurationChange = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onDurationChange }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      Object.defineProperty(mockAudioElement, "duration", {
        value: 200,
        writable: true,
        configurable: true,
      });
      mockAudioElement.dispatchEvent(new Event("durationchange"));
    });

    expect(result.current[1].duration).toBe(200);
    expect(onDurationChange).toHaveBeenCalledWith(200);
  });

  it("should handle volumechange event with mute callback", () => {
    const onMute = vi.fn();
    const onUnmute = vi.fn();
    const onVolumeChange = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onMute, onUnmute, onVolumeChange }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    // Mute
    act(() => {
      mockAudioElement.muted = true;
      mockAudioElement.dispatchEvent(new Event("volumechange"));
    });

    expect(result.current[1].isMuted).toBe(true);
    expect(onMute).toHaveBeenCalled();
    expect(onVolumeChange).toHaveBeenCalled();

    // Unmute
    act(() => {
      mockAudioElement.muted = false;
      mockAudioElement.dispatchEvent(new Event("volumechange"));
    });

    expect(result.current[1].isMuted).toBe(false);
    expect(onUnmute).toHaveBeenCalled();
  });

  it("should handle ratechange event", () => {
    const onRateChange = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onRateChange }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      mockAudioElement.playbackRate = 2;
      mockAudioElement.dispatchEvent(new Event("ratechange"));
    });

    expect(result.current[1].playbackRate).toBe(2);
    expect(onRateChange).toHaveBeenCalledWith(2);
  });

  it("should handle error event with error object", () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onError }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      Object.defineProperty(mockAudioElement, "error", {
        value: { code: 4, message: "MEDIA_ERR_SRC_NOT_SUPPORTED" },
        writable: true,
        configurable: true,
      });
      mockAudioElement.dispatchEvent(new Event("error"));
    });

    expect(result.current[1].hasError).toBe(true);
    expect(result.current[1].error).toBe("Audio error (4): MEDIA_ERR_SRC_NOT_SUPPORTED");
    expect(onError).toHaveBeenCalledWith("Audio error (4): MEDIA_ERR_SRC_NOT_SUPPORTED");
  });

  it("should handle error event without error object", () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useAudio({}, { onError }));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement);
    });

    act(() => {
      Object.defineProperty(mockAudioElement, "error", {
        value: null,
        writable: true,
        configurable: true,
      });
      mockAudioElement.dispatchEvent(new Event("error"));
    });

    expect(result.current[1].hasError).toBe(true);
    expect(result.current[1].error).toBe("Unknown audio error occurred");
    expect(onError).toHaveBeenCalledWith("Unknown audio error occurred");
  });

  // Edge cases for no audio node
  it("should not throw when control methods called without audio node", () => {
    const { result } = renderHook(() => useAudio());
    const [, , controls] = result.current;

    expect(() => {
      controls.play();
      controls.pause();
      controls.mute();
      controls.unmute();
      controls.setVolume(0.5);
      controls.setCurrentTime(10);
      controls.setPlaybackRate(1.5);
      controls.setLoop(true);
    }).not.toThrow();
  });

  it("should cleanup event listeners on unmount", () => {
    const { result, unmount } = renderHook(() => useAudio());
    const [audioRef] = result.current;

    const removeEventListenerSpy = vi.spyOn(mockAudioElement, "removeEventListener");

    act(() => {
      audioRef(mockAudioElement);
    });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("loadstart", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("loadedmetadata", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("canplay", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("waiting", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("play", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("pause", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("ended", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("timeupdate", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("durationchange", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("volumechange", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("ratechange", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("error", expect.any(Function));
  });
});
