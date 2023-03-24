// useSpeech.ts
import { noop } from "@/utils/noop";
import { useRef, useCallback, useState, useEffect } from "react";
import { useFreshCallback } from "./useFreshCallback";

interface UseSpeechOptions {
  text: string;
  language?: string;
  voiceURI?: string;
  onEnd?: () => void;
  volume?: number;
  pitch?: number;
  rate?: number;
}

interface SpeechControls {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isPlaying: boolean;
}

function useSpeech(options: UseSpeechOptions): SpeechControls {
  const {
    text,
    language = "en-US",
    voiceURI,
    onEnd = noop,
    volume = 1,
    pitch = 1,
    rate = 1,
  } = options;

  const freshOnEnd = useFreshCallback(onEnd);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (speechRef.current && isPlaying) {
      speechRef.current.text = text;
      speechRef.current.lang = language;
      speechRef.current.volume = volume;
      speechRef.current.pitch = pitch;
      speechRef.current.rate = rate;

      if (voiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(
          (voice) => voice.voiceURI === voiceURI
        );
        if (selectedVoice) {
          speechRef.current.voice = selectedVoice;
        }
      }
    }
  }, [text, isPlaying, language, voiceURI, volume, pitch, rate]);

  const start = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      console.error("Web Speech API is not supported in your browser.");
      return;
    }

    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }

    speechRef.current = new SpeechSynthesisUtterance(text);
    speechRef.current.lang = language;
    speechRef.current.volume = volume;
    speechRef.current.pitch = pitch;
    speechRef.current.rate = rate;

    if (voiceURI) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find((voice) => voice.voiceURI === voiceURI);
      if (selectedVoice) {
        speechRef.current.voice = selectedVoice;
      }
    }

    speechRef.current.onstart = () => setIsPlaying(true);
    speechRef.current.onend = () => {
      setIsPlaying(false);
      freshOnEnd();
    };
    speechRef.current.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(speechRef.current);
  }, [text, language, volume, pitch, rate, voiceURI, freshOnEnd]);

  const pause = useCallback(() => {
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const resume = useCallback(() => {
    if (window.speechSynthesis && !isPlaying) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  return {
    start,
    pause,
    resume,
    stop,
    isPlaying,
  };
}

export { useSpeech };
