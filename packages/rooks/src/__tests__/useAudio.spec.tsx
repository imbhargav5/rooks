import { renderHook, act } from "@testing-library/react";
import { useAudio } from "@/hooks/useAudio";

// Mock HTMLAudioElement
const mockPlay = jest.fn().mockResolvedValue(undefined);
const mockPause = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

const mockAudioElement = {
  play: mockPlay,
  pause: mockPause,
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  muted: false,
  volume: 1,
  playbackRate: 1,
  loop: false,
  preload: "metadata",
  autoplay: false,
  currentTime: 0,
  duration: 100,
  error: null,
};

// Mock the HTMLAudioElement constructor
Object.defineProperty(window, "HTMLAudioElement", {
  writable: true,
  value: jest.fn().mockImplementation(() => mockAudioElement),
});

describe("useAudio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useAudio).not.toBeUndefined();
  });

  it("should return audioRef, state, and controls", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, state, controls] = result.current;

    expect(audioRef).toBeInstanceOf(Function);
    expect(state).toEqual(
      expect.objectContaining({
        isPlaying: false,
        isMuted: false,
        volume: 1,
        currentTime: 0,
        duration: 0,
        playbackRate: 1,
        isLoading: false,
        isBuffering: false,
        loop: false,
        hasError: false,
      })
    );
    expect(controls).toEqual(
      expect.objectContaining({
        play: expect.any(Function),
        pause: expect.any(Function),
        togglePlay: expect.any(Function),
        mute: expect.any(Function),
        unmute: expect.any(Function),
        toggleMute: expect.any(Function),
        setVolume: expect.any(Function),
        setCurrentTime: expect.any(Function),
        setPlaybackRate: expect.any(Function),
        seek: expect.any(Function),
        fastForward: expect.any(Function),
        rewind: expect.any(Function),
        setLoop: expect.any(Function),
      })
    );
  });

  it("should initialize with custom options", () => {
    const options = {
      autoPlay: true,
      isMuted: true,
      volume: 0.5,
      playbackRate: 1.5,
      loop: true,
      preload: "auto" as const,
    };

    const { result } = renderHook(() => useAudio(options));
    const [, state] = result.current;

    expect(state.isMuted).toBe(true);
    expect(state.volume).toBe(0.5);
    expect(state.playbackRate).toBe(1.5);
    expect(state.loop).toBe(true);
  });

  it("should handle play and pause controls", async () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, , controls] = result.current;

    // Simulate audio element being attached
    act(() => {
      audioRef(mockAudioElement as any);
    });

    // Test play
    await act(async () => {
      await controls.play();
    });
    expect(mockPlay).toHaveBeenCalled();

    // Test pause
    act(() => {
      controls.pause();
    });
    expect(mockPause).toHaveBeenCalled();
  });

  it("should handle volume control", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, , controls] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    act(() => {
      controls.setVolume(0.7);
    });

    expect(mockAudioElement.volume).toBe(0.7);
  });

  it("should clamp volume between 0 and 1", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, , controls] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    // Test volume above 1
    act(() => {
      controls.setVolume(1.5);
    });
    expect(mockAudioElement.volume).toBe(1);

    // Test volume below 0
    act(() => {
      controls.setVolume(-0.5);
    });
    expect(mockAudioElement.volume).toBe(0);
  });

  it("should handle mute and unmute", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, , controls] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    act(() => {
      controls.mute();
    });
    expect(mockAudioElement.muted).toBe(true);

    act(() => {
      controls.unmute();
    });
    expect(mockAudioElement.muted).toBe(false);
  });

  it("should handle playback rate control", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, , controls] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    act(() => {
      controls.setPlaybackRate(2);
    });
    expect(mockAudioElement.playbackRate).toBe(2);
  });

  it("should clamp playback rate between 0.25 and 4", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, , controls] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    // Test rate above 4
    act(() => {
      controls.setPlaybackRate(5);
    });
    expect(mockAudioElement.playbackRate).toBe(4);

    // Test rate below 0.25
    act(() => {
      controls.setPlaybackRate(0.1);
    });
    expect(mockAudioElement.playbackRate).toBe(0.25);
  });

  it("should handle seeking", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, , controls] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    // Mock current state with duration
    mockAudioElement.currentTime = 10;
    mockAudioElement.duration = 100;

    act(() => {
      controls.setCurrentTime(50);
    });
    expect(mockAudioElement.currentTime).toBe(50);

    act(() => {
      controls.seek(10);
    });
    expect(mockAudioElement.currentTime).toBe(60);
  });

  it("should handle fast forward and rewind", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, , controls] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    mockAudioElement.currentTime = 50;
    mockAudioElement.duration = 100;

    act(() => {
      controls.fastForward(15);
    });
    expect(mockAudioElement.currentTime).toBe(65);

    act(() => {
      controls.rewind(20);
    });
    expect(mockAudioElement.currentTime).toBe(45);
  });

  it("should handle loop control", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, state, controls] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    act(() => {
      controls.setLoop(true);
    });
    expect(mockAudioElement.loop).toBe(true);
    // Note: state update would be tested with proper event simulation
  });

  it("should handle callbacks", () => {
    const onPlay = jest.fn();
    const onPause = jest.fn();
    const onError = jest.fn();

    const callbacks = {
      onPlay,
      onPause,
      onError,
    };

    const { result } = renderHook(() => useAudio({}, callbacks));
    const [audioRef] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    // Simulate events would be called here in a more complete test
    // This would require more sophisticated mocking of the audio element events
  });

  it("should handle play errors", async () => {
    const mockPlayWithError = jest.fn().mockRejectedValue(new Error("Play failed"));
    const mockAudioWithError = {
      ...mockAudioElement,
      play: mockPlayWithError,
    };

    const onError = jest.fn();
    const { result } = renderHook(() => useAudio({}, { onError }));
    const [audioRef, , controls] = result.current;

    act(() => {
      audioRef(mockAudioWithError as any);
    });

    await expect(
      act(async () => {
        await controls.play();
      })
    ).rejects.toThrow("Play failed");
  });

  it("should handle toggle play", async () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, , controls] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    // Test toggle play when not playing
    await act(async () => {
      await controls.togglePlay();
    });
    expect(mockPlay).toHaveBeenCalled();

    // Reset mocks and simulate playing state
    jest.clearAllMocks();
    
    // This would require proper state management simulation
    // In a real test, we'd need to simulate the audio events to update state
  });

  it("should handle toggle mute", () => {
    const { result } = renderHook(() => useAudio());
    const [audioRef, , controls] = result.current;

    act(() => {
      audioRef(mockAudioElement as any);
    });

    // Test toggle mute when not muted
    act(() => {
      controls.toggleMute();
    });
    expect(mockAudioElement.muted).toBe(true);

    // Test toggle mute when muted
    mockAudioElement.muted = true;
    act(() => {
      controls.toggleMute();
    });
    expect(mockAudioElement.muted).toBe(false);
  });
});
