import { useCallback, useEffect, useRef, useState } from "react";

export type MediaRecorderOptions = {
    audio?: boolean;
    video?: boolean;
    mediaStreamConstraints?: MediaStreamConstraints;
    mimeType?: string;
    bitsPerSecond?: number;
    audioBitsPerSecond?: number;
    videoBitsPerSecond?: number;
    onDataAvailable?: (event: BlobEvent) => void;
};

export type RecordingState = "inactive" | "recording" | "paused";

export type MediaRecorderHandler = {
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
    recordingState: RecordingState;
    recordedChunks: Blob[];
    mediaBlob: Blob | null;
    error: Error | null;
    mediaStream: MediaStream | null;
    clearRecording: () => void;
};

/**
 * useMediaRecorder
 * @description A hook to record audio/video from user devices
 * @param {MediaRecorderOptions} options Options for MediaRecorder
 * @returns {MediaRecorderHandler} Methods and state for recording media
 * @see {@link https://rooks.vercel.app/docs/useMediaRecorder}
 *
 * @example
 *
 * const { 
 *   startRecording, 
 *   stopRecording, 
 *   pauseRecording, 
 *   resumeRecording, 
 *   recordingState, 
 *   recordedChunks, 
 *   mediaBlob 
 * } = useMediaRecorder({ audio: true, video: true });
 *
 * // Start recording
 * startRecording();
 *
 * // Stop and get result
 * stopRecording();
 * console.log(mediaBlob);
 */
function useMediaRecorder(options: MediaRecorderOptions = {}): MediaRecorderHandler {
    const {
        audio = true,
        video = false,
        mediaStreamConstraints,
        mimeType,
        bitsPerSecond,
        audioBitsPerSecond,
        videoBitsPerSecond,
        onDataAvailable,
    } = options;

    const [recordingState, setRecordingState] = useState<RecordingState>("inactive");
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const clearRecording = useCallback(() => {
        setRecordedChunks([]);
        setMediaBlob(null);
    }, []);

    const startRecording = useCallback(async (): Promise<void> => {
        try {
            clearRecording();

            // Get media stream if we don't have one yet
            if (!mediaStream) {
                const constraints: MediaStreamConstraints = mediaStreamConstraints || {
                    audio,
                    video
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                setMediaStream(stream);

                // Create media recorder with options
                const recorderOptions: MediaRecorderOptions = {};

                if (mimeType && MediaRecorder.isTypeSupported(mimeType)) {
                    recorderOptions.mimeType = mimeType;
                }

                if (bitsPerSecond) recorderOptions.bitsPerSecond = bitsPerSecond;
                if (audioBitsPerSecond) recorderOptions.audioBitsPerSecond = audioBitsPerSecond;
                if (videoBitsPerSecond) recorderOptions.videoBitsPerSecond = videoBitsPerSecond;

                mediaRecorderRef.current = new MediaRecorder(stream, recorderOptions);
            } else if (!mediaRecorderRef.current) {
                const recorderOptions: MediaRecorderOptions = {};

                if (mimeType && MediaRecorder.isTypeSupported(mimeType)) {
                    recorderOptions.mimeType = mimeType;
                }

                if (bitsPerSecond) recorderOptions.bitsPerSecond = bitsPerSecond;
                if (audioBitsPerSecond) recorderOptions.audioBitsPerSecond = audioBitsPerSecond;
                if (videoBitsPerSecond) recorderOptions.videoBitsPerSecond = videoBitsPerSecond;

                mediaRecorderRef.current = new MediaRecorder(mediaStream, recorderOptions);
            }

            // Set up event handlers
            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                if (event.data && event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                    onDataAvailable?.(event);
                }
            };

            mediaRecorderRef.current.onstart = () => {
                setRecordingState("recording");
            };

            mediaRecorderRef.current.onstop = () => {
                setRecordingState("inactive");

                // Create a single Blob from all chunks
                if (recordedChunks.length > 0) {
                    const blob = new Blob(recordedChunks, {
                        type: mediaRecorderRef.current?.mimeType || "video/webm"
                    });
                    setMediaBlob(blob);
                }
            };

            mediaRecorderRef.current.onpause = () => {
                setRecordingState("paused");
            };

            mediaRecorderRef.current.onresume = () => {
                setRecordingState("recording");
            };

            mediaRecorderRef.current.onerror = (event) => {
                setError(new Error(`MediaRecorder error: ${event.error}`));
            };

            // Start recording with a timeslice of 250ms
            mediaRecorderRef.current.start(250);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            throw err;
        }
    }, [
        audio,
        video,
        mediaStreamConstraints,
        mimeType,
        bitsPerSecond,
        audioBitsPerSecond,
        videoBitsPerSecond,
        onDataAvailable,
        mediaStream,
        clearRecording,
        recordedChunks
    ]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && recordingState !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    }, [recordingState]);

    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && recordingState === "recording") {
            mediaRecorderRef.current.pause();
        }
    }, [recordingState]);

    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && recordingState === "paused") {
            mediaRecorderRef.current.resume();
        }
    }, [recordingState]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && recordingState !== "inactive") {
                mediaRecorderRef.current.stop();
            }

            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        };
    }, [mediaStream, recordingState]);

    return {
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        recordingState,
        recordedChunks,
        mediaBlob,
        error,
        mediaStream,
        clearRecording
    };
}

export { useMediaRecorder }; 