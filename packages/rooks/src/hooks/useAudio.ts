/**
 * useAudio
 * @description Audio hook
 * @see {@link https://rooks.vercel.app/docs/useAudio}
 */
import { useState, useEffect, RefCallback } from "react";
import { useFreshCallback } from "@/hooks/useFreshCallback";

const noop = () => {};

type UseAudioOptions = {
  autoPlay?: boolean;
  isMuted?: boolean;
};

type UseAudioCallbacks = {
  onPlay?: () => void;
  onPause?: () => void;
  onMute?: () => void;
  onUnmute?: () => void;
  onLoadedMetadata?: () => void;
};

type AudioState = {
  isPlaying: boolean;
  isMuted: boolean;
};

type AudioControls = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
};

function useAudio(
  options: UseAudioOptions = {},
  callbacks: UseAudioCallbacks = {}
): [RefCallback<HTMLAudioElement>, AudioState, AudioControls] {
  const { autoPlay = false, isMuted: initialIsMuted = false } = options;
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  const [audioNode, setAudioNode] = useState<HTMLAudioElement | null>(null);

  const onPlay = useFreshCallback(callbacks.onPlay ?? noop);
  const onPause = useFreshCallback(callbacks.onPause ?? noop);
  const onMute = useFreshCallback(callbacks.onMute ?? noop);
  const onUnmute = useFreshCallback(callbacks.onUnmute ?? noop);
  const onLoadedMetadata = useFreshCallback(callbacks.onLoadedMetadata ?? noop);

  const audioCallbackRef = (node: HTMLAudioElement | null) => {
    if (node !== null) {
      setAudioNode(node);
    }
  };

  useEffect(() => {
    if (!audioNode) return;

    if (isPlaying) {
      audioNode.play();
    } else {
      audioNode.pause();
    }
  }, [audioNode, isPlaying]);

  useEffect(() => {
    if (!audioNode) return;

    audioNode.muted = isMuted;
  }, [audioNode, isMuted]);

  useEffect(() => {
    if (!audioNode) return;

    const handleLoadedMetadata = () => {
      if (autoPlay) {
        audioNode?.play();
      }
      onLoadedMetadata();
    };

    const handlePlay = () => {
      onPlay();
    };

    const handlePause = () => {
      onPause();
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audioNode?.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioNode?.addEventListener("play", handlePlay);
    audioNode?.addEventListener("pause", handlePause);
    audioNode?.addEventListener("ended", handleEnded);

    return () => {
      audioNode?.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioNode?.removeEventListener("play", handlePlay);
      audioNode?.removeEventListener("pause", handlePause);
      audioNode?.removeEventListener("ended", handleEnded);
    };
  }, [autoPlay, onLoadedMetadata, onPlay, onPause, audioNode]);

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const mute = () => {
    setIsMuted(true);
    onMute();
  };

  const unmute = () => {
    setIsMuted(false);
    onUnmute();
  };

  const toggleMute = () => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  };

  const controls: AudioControls = {
    play,
    pause,
    togglePlay,
    mute,
    unmute,
    toggleMute,
  };

  const state: AudioState = {
    isPlaying,
    isMuted,
  };

  return [audioCallbackRef, state, controls];
}

export { useAudio };
