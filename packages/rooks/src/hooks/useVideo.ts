/**
 * useVideo
 * @description Video hook for react
 * @see {@link https://rooks.vercel.app/docs/hooks/useVideo}
 */
import { useRef, useState, useEffect, RefObject } from "react";

type VideoState = {
  currentTime: number;
  duration: number;
  isPaused: boolean;
  isMuted: boolean;
  volume: number;
};

type VideoControls = {
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  fastForward: (seconds: number) => void;
  rewind: (seconds: number) => void;
  toggleFullScreen: () => void;
};

const useVideo = (): [
  RefObject<HTMLVideoElement | null>,
  VideoState,
  VideoControls
] => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoState>({
    currentTime: 0,
    duration: 0,
    isPaused: true,
    isMuted: false,
    volume: 1,
  });

  const controls: VideoControls = {
    play: () => {
      if (videoRef.current) {
        videoRef.current.play();
        setState({ ...state, isPaused: false });
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setState({ ...state, isPaused: true });
      }
    },
    toggleMute: () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
        setState({ ...state, isMuted: videoRef.current.muted });
      }
    },
    setVolume: (volume: number) => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
        setState({ ...state, volume });
      }
    },
    setCurrentTime: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        setState({ ...state, currentTime: time });
      }
    },
    fastForward: (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime += seconds;
        setState({ ...state, currentTime: videoRef.current.currentTime });
      }
    },
    rewind: (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime -= seconds;
        setState({ ...state, currentTime: videoRef.current.currentTime });
      }
    },
    toggleFullScreen: () => {
      if (videoRef.current) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          videoRef.current.requestFullscreen();
        }
      }
    },
  };

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      setState((prevState) => ({
        ...prevState,
        currentTime: video!.currentTime,
      }));
    };

    const handleDurationChange = () => {
      setState((prevState) => ({
        ...prevState,
        duration: video!.duration,
      }));
    };

    const handlePause = () => {
      setState((prevState) => ({
        ...prevState,
        isPaused: true,
      }));
    };

    const handlePlay = () => {
      setState((prevState) => ({
        ...prevState,
        isPaused: false,
      }));
    };

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("durationchange", handleDurationChange);
      video.addEventListener("pause", handlePause);
      video.addEventListener("play", handlePlay);
    }

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("durationchange", handleDurationChange);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("play", handlePlay);
      }
    };
  }, [videoRef]);

  return [videoRef, state, controls];
};

export { useVideo };
