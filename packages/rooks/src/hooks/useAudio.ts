/**
 * useAudio
 * @description Enhanced audio hook with comprehensive controls and state management
 * @see {@link https://rooks.vercel.app/docs/hooks/useAudio}
 */
import { useState, useEffect, RefCallback } from "react";
import { useFreshCallback } from "@/hooks/useFreshCallback";

const noop = () => {};

type UseAudioOptions = {
  autoPlay?: boolean;
  isMuted?: boolean;
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
  preload?: "none" | "metadata" | "auto";
};

type UseAudioCallbacks = {
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onMute?: () => void;
  onUnmute?: () => void;
  onLoadedMetadata?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onRateChange?: (rate: number) => void;
  onError?: (error: string) => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onWaiting?: () => void;
};

type AudioState = {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isLoading: boolean;
  isBuffering: boolean;
  loop: boolean;
  hasError: boolean;
  error?: string;
};

type AudioControls = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  seek: (seconds: number) => void;
  fastForward: (seconds: number) => void;
  rewind: (seconds: number) => void;
  setLoop: (loop: boolean) => void;
};

function useAudio(
  options: UseAudioOptions = {},
  callbacks: UseAudioCallbacks = {}
): [RefCallback<HTMLAudioElement>, AudioState, AudioControls] {
  const {
    autoPlay = false,
    isMuted: initialIsMuted = false,
    volume: initialVolume = 1,
    playbackRate: initialPlaybackRate = 1,
    loop: initialLoop = false,
    preload = "metadata",
  } = options;

  const [audioNode, setAudioNode] = useState<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isMuted: initialIsMuted,
    volume: initialVolume,
    currentTime: 0,
    duration: 0,
    playbackRate: initialPlaybackRate,
    isLoading: false,
    isBuffering: false,
    loop: initialLoop,
    hasError: false,
  });

  // Fresh callbacks
  const onPlay = useFreshCallback(callbacks.onPlay ?? noop);
  const onPause = useFreshCallback(callbacks.onPause ?? noop);
  const onEnded = useFreshCallback(callbacks.onEnded ?? noop);
  const onMute = useFreshCallback(callbacks.onMute ?? noop);
  const onUnmute = useFreshCallback(callbacks.onUnmute ?? noop);
  const onLoadedMetadata = useFreshCallback(callbacks.onLoadedMetadata ?? noop);
  const onTimeUpdate = useFreshCallback(callbacks.onTimeUpdate ?? noop);
  const onDurationChange = useFreshCallback(callbacks.onDurationChange ?? noop);
  const onVolumeChange = useFreshCallback(callbacks.onVolumeChange ?? noop);
  const onRateChange = useFreshCallback(callbacks.onRateChange ?? noop);
  const onError = useFreshCallback(callbacks.onError ?? noop);
  const onLoadStart = useFreshCallback(callbacks.onLoadStart ?? noop);
  const onCanPlay = useFreshCallback(callbacks.onCanPlay ?? noop);
  const onWaiting = useFreshCallback(callbacks.onWaiting ?? noop);

  const audioCallbackRef = (node: HTMLAudioElement | null) => {
    if (node !== null) {
      setAudioNode(node);
    }
  };

  // Initialize audio element properties
  useEffect(() => {
    if (!audioNode) return;

    audioNode.muted = state.isMuted;
    audioNode.volume = state.volume;
    audioNode.playbackRate = state.playbackRate;
    audioNode.loop = state.loop;
    audioNode.preload = preload;

    if (autoPlay) {
      audioNode.autoplay = true;
    }
  }, [audioNode, autoPlay, preload]);

  // Event listeners
  useEffect(() => {
    if (!audioNode) return;

    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoading: true, hasError: false }));
      onLoadStart();
    };

    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        duration: audioNode.duration,
        isLoading: false,
        hasError: false,
      }));
      onLoadedMetadata();
      onDurationChange(audioNode.duration);
    };

    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isBuffering: false, hasError: false }));
      onCanPlay();
    };

    const handleWaiting = () => {
      setState(prev => ({ ...prev, isBuffering: true }));
      onWaiting();
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true, hasError: false }));
      onPlay();
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      onPause();
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      onEnded();
    };

    const handleTimeUpdate = () => {
      const currentTime = audioNode.currentTime;
      setState(prev => ({ ...prev, currentTime }));
      onTimeUpdate(currentTime);
    };

    const handleDurationChange = () => {
      const duration = audioNode.duration;
      setState(prev => ({ ...prev, duration }));
      onDurationChange(duration);
    };

    const handleVolumeChange = () => {
      const volume = audioNode.volume;
      const isMuted = audioNode.muted;
      setState(prev => {
        const newState = { ...prev, volume, isMuted };
        if (isMuted !== prev.isMuted) {
          if (isMuted) {
            onMute();
          } else {
            onUnmute();
          }
        }
        return newState;
      });
      onVolumeChange(volume);
    };

    const handleRateChange = () => {
      const playbackRate = audioNode.playbackRate;
      setState(prev => ({ ...prev, playbackRate }));
      onRateChange(playbackRate);
    };

    const handleError = () => {
      const error = audioNode.error;
      const errorMessage = error
        ? `Audio error (${error.code}): ${error.message}`
        : "Unknown audio error occurred";
      
      setState(prev => ({
        ...prev,
        hasError: true,
        error: errorMessage,
        isLoading: false,
        isBuffering: false,
        isPlaying: false,
      }));
      onError(errorMessage);
    };

    // Add event listeners
    audioNode.addEventListener("loadstart", handleLoadStart);
    audioNode.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioNode.addEventListener("canplay", handleCanPlay);
    audioNode.addEventListener("waiting", handleWaiting);
    audioNode.addEventListener("play", handlePlay);
    audioNode.addEventListener("pause", handlePause);
    audioNode.addEventListener("ended", handleEnded);
    audioNode.addEventListener("timeupdate", handleTimeUpdate);
    audioNode.addEventListener("durationchange", handleDurationChange);
    audioNode.addEventListener("volumechange", handleVolumeChange);
    audioNode.addEventListener("ratechange", handleRateChange);
    audioNode.addEventListener("error", handleError);

    return () => {
      audioNode.removeEventListener("loadstart", handleLoadStart);
      audioNode.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioNode.removeEventListener("canplay", handleCanPlay);
      audioNode.removeEventListener("waiting", handleWaiting);
      audioNode.removeEventListener("play", handlePlay);
      audioNode.removeEventListener("pause", handlePause);
      audioNode.removeEventListener("ended", handleEnded);
      audioNode.removeEventListener("timeupdate", handleTimeUpdate);
      audioNode.removeEventListener("durationchange", handleDurationChange);
      audioNode.removeEventListener("volumechange", handleVolumeChange);
      audioNode.removeEventListener("ratechange", handleRateChange);
      audioNode.removeEventListener("error", handleError);
    };
  }, [
    audioNode,
    onLoadStart,
    onLoadedMetadata,
    onCanPlay,
    onWaiting,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onDurationChange,
    onVolumeChange,
    onRateChange,
    onError,
    onMute,
    onUnmute,
  ]);

  // Control methods
  const play = (): void => {
    if (!audioNode) return;
    
    audioNode.play().catch((error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to play audio";
      setState(prev => ({
        ...prev,
        hasError: true,
        error: errorMessage,
        isPlaying: false,
      }));
      onError(errorMessage);
    });
  };

  const pause = (): void => {
    if (!audioNode) return;
    audioNode.pause();
  };

  const togglePlay = (): void => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const mute = (): void => {
    if (!audioNode) return;
    audioNode.muted = true;
  };

  const unmute = (): void => {
    if (!audioNode) return;
    audioNode.muted = false;
  };

  const toggleMute = (): void => {
    if (state.isMuted) {
      unmute();
    } else {
      mute();
    }
  };

  const setVolume = (volume: number): void => {
    if (!audioNode) return;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioNode.volume = clampedVolume;
  };

  const setCurrentTime = (time: number): void => {
    if (!audioNode) return;
    const clampedTime = Math.max(0, Math.min(state.duration || 0, time));
    audioNode.currentTime = clampedTime;
  };

  const setPlaybackRate = (rate: number): void => {
    if (!audioNode) return;
    const clampedRate = Math.max(0.25, Math.min(4, rate));
    audioNode.playbackRate = clampedRate;
  };

  const seek = (seconds: number): void => {
    setCurrentTime(state.currentTime + seconds);
  };

  const fastForward = (seconds: number = 10): void => {
    seek(seconds);
  };

  const rewind = (seconds: number = 10): void => {
    seek(-seconds);
  };

  const setLoop = (loop: boolean): void => {
    if (!audioNode) return;
    audioNode.loop = loop;
    setState(prev => ({ ...prev, loop }));
  };

  const controls: AudioControls = {
    play,
    pause,
    togglePlay,
    mute,
    unmute,
    toggleMute,
    setVolume,
    setCurrentTime,
    setPlaybackRate,
    seek,
    fastForward,
    rewind,
    setLoop,
  };

  return [audioCallbackRef, state, controls];
}

export { useAudio };
export type { UseAudioOptions, UseAudioCallbacks, AudioState, AudioControls };
