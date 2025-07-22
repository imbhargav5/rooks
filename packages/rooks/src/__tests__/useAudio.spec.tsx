import { renderHook, act } from "@testing-library/react";
import { useAudio } from "@/hooks/useAudio";

describe("useAudio", () => {

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
      // New properties are additive (not breaking)
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
      onPlay: jest.fn(),
      onPause: jest.fn(),
      onMute: jest.fn(),
      onUnmute: jest.fn(),
      onLoadedMetadata: jest.fn(),
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
      onPlay: jest.fn(),
      onPause: jest.fn(),
      onMute: jest.fn(),
      onUnmute: jest.fn(),
      onLoadedMetadata: jest.fn(),
      // New callbacks
      onTimeUpdate: jest.fn(),
      onVolumeChange: jest.fn(),
      onError: jest.fn(),
    };

    const { result } = renderHook(() => useAudio({}, enhancedCallbacks));
    
    // Should not throw and should return proper structure
    expect(result.current).toHaveLength(3);
  });
});
