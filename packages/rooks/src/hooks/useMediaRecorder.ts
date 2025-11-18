import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Recording state
 */
type RecordingState = "idle" | "recording" | "paused" | "stopped";

/**
 * Options for media recording
 */
interface MediaRecorderOptions {
  /**
   * MIME type for the recording
   */
  mimeType?: string;
  /**
   * Audio bits per second
   */
  audioBitsPerSecond?: number;
  /**
   * Video bits per second
   */
  videoBitsPerSecond?: number;
  /**
   * Overall bits per second
   */
  bitsPerSecond?: number;
}

/**
 * Return value for the useMediaRecorder hook
 */
interface UseMediaRecorderReturnValue {
  /**
   * Start recording
   */
  startRecording: () => void;
  /**
   * Stop recording
   */
  stopRecording: () => void;
  /**
   * Pause recording
   */
  pauseRecording: () => void;
  /**
   * Resume recording
   */
  resumeRecording: () => void;
  /**
   * Current recording state
   */
  recordingState: RecordingState;
  /**
   * Recorded data as a Blob
   */
  data: Blob | null;
  /**
   * URL to the recorded data
   */
  dataUrl: string | null;
  /**
   * Any error that occurred
   */
  error: Error | null;
  /**
   * Whether MediaRecorder API is supported
   */
  isSupported: boolean;
}

/**
 * useMediaRecorder hook
 *
 * Audio/video recording using the MediaRecorder API.
 * Provides methods to record, pause, resume, and stop media capture.
 *
 * @param stream - MediaStream to record (from getUserMedia, getDisplayMedia, etc.)
 * @param options - Recording options
 * @returns Object containing recording controls and state
 *
 * @example
 * ```tsx
 * import { useMediaRecorder } from "rooks";
 * import { useEffect, useState } from "react";
 *
 * function AudioRecorder() {
 *   const [stream, setStream] = useState<MediaStream | null>(null);
 *
 *   useEffect(() => {
 *     navigator.mediaDevices.getUserMedia({ audio: true })
 *       .then(setStream)
 *       .catch(console.error);
 *   }, []);
 *
 *   const {
 *     startRecording,
 *     stopRecording,
 *     pauseRecording,
 *     resumeRecording,
 *     recordingState,
 *     dataUrl,
 *     error,
 *     isSupported,
 *   } = useMediaRecorder(stream, { mimeType: "audio/webm" });
 *
 *   if (!isSupported) {
 *     return <div>MediaRecorder not supported</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h2>Audio Recorder</h2>
 *       <p>Status: {recordingState}</p>
 *       <button onClick={startRecording} disabled={recordingState === "recording"}>
 *         Start
 *       </button>
 *       <button onClick={pauseRecording} disabled={recordingState !== "recording"}>
 *         Pause
 *       </button>
 *       <button onClick={resumeRecording} disabled={recordingState !== "paused"}>
 *         Resume
 *       </button>
 *       <button onClick={stopRecording} disabled={recordingState === "idle"}>
 *         Stop
 *       </button>
 *       {dataUrl && <audio src={dataUrl} controls />}
 *       {error && <p>Error: {error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/useMediaRecorder
 */
function useMediaRecorder(
  stream: MediaStream | null,
  options: MediaRecorderOptions = {}
): UseMediaRecorderReturnValue {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [data, setData] = useState<Blob | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const isSupported =
    typeof window !== "undefined" && "MediaRecorder" in window;

  useEffect(() => {
    if (!isSupported || !stream) {
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: options.mimeType || "video/webm",
        });
        setData(blob);
        setDataUrl(URL.createObjectURL(blob));
        setRecordingState("stopped");
        chunksRef.current = [];
      };

      mediaRecorder.onerror = (event: Event) => {
        const err = new Error(
          `MediaRecorder error: ${(event as any).error?.message || "Unknown error"}`
        );
        setError(err);
        setRecordingState("idle");
      };

      return () => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
      };
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to create MediaRecorder");
      setError(error);
    }
  }, [stream, options, isSupported]);

  const startRecording = useCallback(() => {
    if (!isSupported) {
      const err = new Error("MediaRecorder is not supported");
      setError(err);
      return;
    }

    if (!mediaRecorderRef.current) {
      const err = new Error("MediaRecorder not initialized");
      setError(err);
      return;
    }

    try {
      chunksRef.current = [];
      setData(null);
      setDataUrl(null);
      setError(null);
      mediaRecorderRef.current.start();
      setRecordingState("recording");
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to start recording");
      setError(error);
    }
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState !== "idle") {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to stop recording");
        setError(error);
      }
    }
  }, [recordingState]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      try {
        mediaRecorderRef.current.pause();
        setRecordingState("paused");
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to pause recording");
        setError(error);
      }
    }
  }, [recordingState]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === "paused") {
      try {
        mediaRecorderRef.current.resume();
        setRecordingState("recording");
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to resume recording");
        setError(error);
      }
    }
  }, [recordingState]);

  // Clean up data URL on unmount
  useEffect(() => {
    return () => {
      if (dataUrl) {
        URL.revokeObjectURL(dataUrl);
      }
    };
  }, [dataUrl]);

  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    recordingState,
    data,
    dataUrl,
    error,
    isSupported,
  };
}

export { useMediaRecorder };
export type {
  UseMediaRecorderReturnValue,
  MediaRecorderOptions,
  RecordingState,
};
