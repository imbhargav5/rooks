---
id: useMediaRecorder
title: useMediaRecorder
sidebar_label: useMediaRecorder
---

## About

React hook for audio/video recording using the MediaRecorder API. Provides methods to record, pause, resume, and stop media capture from any MediaStream source.

## Installation

```bash
npm install rooks
```

## Usage

```jsx
import { useMediaRecorder } from "rooks";
import { useEffect, useState } from "react";

function AudioRecorder() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Get audio stream
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(setStream)
      .catch((err) => console.error("Error accessing microphone:", err));

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    recordingState,
    dataUrl,
    error,
    isSupported,
  } = useMediaRecorder(stream, { mimeType: "audio/webm" });

  if (!isSupported) {
    return <div>MediaRecorder API not supported in this browser</div>;
  }

  return (
    <div>
      <h2>Audio Recorder</h2>
      <p>Status: <strong>{recordingState}</strong></p>

      <div>
        <button
          onClick={startRecording}
          disabled={recordingState === "recording" || !stream}
        >
          Start Recording
        </button>
        <button
          onClick={pauseRecording}
          disabled={recordingState !== "recording"}
        >
          Pause
        </button>
        <button
          onClick={resumeRecording}
          disabled={recordingState !== "paused"}
        >
          Resume
        </button>
        <button
          onClick={stopRecording}
          disabled={recordingState === "idle" || recordingState === "stopped"}
        >
          Stop
        </button>
      </div>

      {dataUrl && (
        <div>
          <h3>Recording</h3>
          <audio src={dataUrl} controls />
          <a href={dataUrl} download="recording.webm">
            Download Recording
          </a>
        </div>
      )}

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </div>
  );
}
```

## Return Value

Returns an object with the following properties:

| Property        | Type                         | Description                                |
| --------------- | ---------------------------- | ------------------------------------------ |
| startRecording  | `() => void`                 | Start recording                            |
| stopRecording   | `() => void`                 | Stop recording                             |
| pauseRecording  | `() => void`                 | Pause recording                            |
| resumeRecording | `() => void`                 | Resume recording                           |
| recordingState  | `RecordingState`             | Current recording state                    |
| data            | `Blob \| null`               | Recorded data as a Blob                    |
| dataUrl         | `string \| null`             | URL to the recorded data                   |
| error           | `Error \| null`              | Any error that occurred                    |
| isSupported     | `boolean`                    | Whether MediaRecorder API is supported     |

## Recording States

- `"idle"` - Not recording
- `"recording"` - Currently recording
- `"paused"` - Recording paused
- `"stopped"` - Recording stopped (data available)

## MediaRecorder Options

The hook accepts an optional options parameter:

| Option              | Type     | Description                        |
| ------------------- | -------- | ---------------------------------- |
| mimeType            | `string` | MIME type for the recording        |
| audioBitsPerSecond  | `number` | Audio bits per second              |
| videoBitsPerSecond  | `number` | Video bits per second              |
| bitsPerSecond       | `number` | Overall bits per second            |

## Examples

### Video Recording

```jsx
function VideoRecorder() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(mediaStream);
  };

  const {
    startRecording,
    stopRecording,
    recordingState,
    dataUrl,
  } = useMediaRecorder(stream, { mimeType: "video/webm" });

  return (
    <div>
      {!stream && <button onClick={startCamera}>Start Camera</button>}
      {stream && (
        <>
          <video
            ref={(video) => {
              if (video && stream) video.srcObject = stream;
            }}
            autoPlay
            muted
          />
          <button onClick={startRecording}>Record</button>
          <button onClick={stopRecording}>Stop</button>
        </>
      )}
      {dataUrl && <video src={dataUrl} controls />}
    </div>
  );
}
```

### Screen Recording

```jsx
function ScreenRecorder() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startScreenCapture = async () => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" },
      audio: true,
    });
    setStream(mediaStream);
  };

  const { startRecording, stopRecording, dataUrl } = useMediaRecorder(stream);

  return (
    <div>
      <button onClick={startScreenCapture}>Share Screen</button>
      {stream && (
        <>
          <button onClick={startRecording}>Start Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
        </>
      )}
      {dataUrl && (
        <div>
          <video src={dataUrl} controls style={{ maxWidth: "100%" }} />
          <a href={dataUrl} download="screen-recording.webm">
            Download
          </a>
        </div>
      )}
    </div>
  );
}
```

## Features

- **Audio/video recording** - Record from any MediaStream source
- **Pause/resume** - Control recording with pause and resume
- **Multiple sources** - Works with microphone, camera, screen capture
- **Automatic cleanup** - Properly manages resources and memory
- **Error handling** - Comprehensive error handling
- **TypeScript support** - Full type definitions with generics

## Browser Support

The MediaRecorder API is supported in:
- Chrome 47+
- Firefox 25+
- Safari 14.1+
- Edge 79+
- Opera 36+

## Notes

- You must obtain a MediaStream before using the hook (via getUserMedia, getDisplayMedia, etc.)
- The recorded Blob is available after calling `stopRecording()`
- `dataUrl` is automatically created and can be used for playback or download
- Data URL is automatically revoked on unmount to prevent memory leaks
- Supported MIME types vary by browser - check `MediaRecorder.isTypeSupported()`
- The MediaRecorder is automatically stopped on component unmount
