---
id: usePictureInPictureApi
title: usePictureInPictureApi
sidebar_label: usePictureInPictureApi
---

## About

Picture-in-Picture hook for React video elements. This hook provides a simple interface to control Picture-in-Picture functionality for video elements, including entering and exiting PiP mode, tracking PiP state, and handling errors.
<br/>

## Examples

### Basic Usage

```jsx
import React, { useRef } from "react";
import { usePictureInPictureApi } from "rooks";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const {
    isPiPActive,
    isSupported,
    error,
    pipWindow,
    enterPiP,
    exitPiP,
    toggle,
  } = usePictureInPictureApi(videoRef);

  return (
    <div>
      <video 
        ref={videoRef} 
        src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        controls
        width="400"
        height="300"
      />
      
      <div>
        <p>PiP Status: {isPiPActive ? "Active" : "Inactive"}</p>
        <p>Browser Support: {isSupported ? "Yes" : "No"}</p>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        
        <button onClick={toggle} disabled={!isSupported}>
          {isPiPActive ? "Exit PiP" : "Enter PiP"}
        </button>
      </div>
    </div>
  );
}
```

### Advanced Usage with Error Handling

```jsx
import React, { useRef, useCallback } from "react";
import { usePictureInPictureApi } from "rooks";

export default function AdvancedVideoPlayer() {
  const videoRef = useRef(null);
  const {
    isPiPActive,
    isSupported,
    error,
    pipWindow,
    enterPiP,
    exitPiP,
    toggle,
  } = usePictureInPictureApi(videoRef);

  const handleEnterPiP = useCallback(async () => {
    try {
      await enterPiP();
      console.log("Successfully entered PiP mode");
    } catch (err) {
      console.error("Failed to enter PiP mode:", err);
    }
  }, [enterPiP]);

  const handleExitPiP = useCallback(async () => {
    try {
      await exitPiP();
      console.log("Successfully exited PiP mode");
    } catch (err) {
      console.error("Failed to exit PiP mode:", err);
    }
  }, [exitPiP]);

  return (
    <div>
      <video 
        ref={videoRef} 
        src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        controls
        width="500"
        height="300"
      />
      
      <div style={{ marginTop: "20px" }}>
        <div>
          <strong>Status:</strong> {isPiPActive ? "In PiP Mode" : "Normal Mode"}
        </div>
        <div>
          <strong>Browser Support:</strong> {isSupported ? "✓ Supported" : "✗ Not Supported"}
        </div>
        {pipWindow && (
          <div>
            <strong>PiP Window Size:</strong> {pipWindow.width}x{pipWindow.height}
          </div>
        )}
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            <strong>Error:</strong> {error.message}
          </div>
        )}
        
        <div style={{ marginTop: "15px" }}>
          <button onClick={handleEnterPiP} disabled={!isSupported || isPiPActive}>
            Enter PiP
          </button>
          <button onClick={handleExitPiP} disabled={!isPiPActive}>
            Exit PiP
          </button>
          <button onClick={toggle} disabled={!isSupported}>
            Toggle PiP
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Multiple Video Players

```jsx
import React, { useRef } from "react";
import { usePictureInPictureApi } from "rooks";

function VideoPlayerCard({ src, title }) {
  const videoRef = useRef(null);
  const {
    isPiPActive,
    isSupported,
    error,
    toggle,
  } = usePictureInPictureApi(videoRef);

  return (
    <div style={{ margin: "20px", padding: "20px", border: "1px solid #ccc" }}>
      <h3>{title}</h3>
      <video 
        ref={videoRef} 
        src={src}
        controls
        width="300"
        height="200"
      />
      
      <div style={{ marginTop: "10px" }}>
        <span>Status: {isPiPActive ? "PiP Active" : "Normal"}</span>
        <button 
          onClick={toggle} 
          disabled={!isSupported}
          style={{ marginLeft: "10px" }}
        >
          {isPiPActive ? "Exit PiP" : "Enter PiP"}
        </button>
        {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
      </div>
    </div>
  );
}

export default function MultipleVideoPlayers() {
  const videos = [
    {
      src: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      title: "Sample Video 1"
    },
    {
      src: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
      title: "Sample Video 2"
    },
    {
      src: "https://sample-videos.com/zip/10/mp4/SampleVideo_480x270_1mb.mp4",
      title: "Sample Video 3"
    }
  ];

  return (
    <div>
      <h2>Multiple Video Players with PiP</h2>
      <p>Only one video can be in Picture-in-Picture mode at a time.</p>
      
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {videos.map((video, index) => (
          <VideoPlayerCard 
            key={index} 
            src={video.src} 
            title={video.title} 
          />
        ))}
      </div>
    </div>
  );
}
```

### Custom Controls with PiP Window Management

```jsx
import React, { useRef, useEffect, useState } from "react";
import { usePictureInPictureApi } from "rooks";

export default function CustomVideoControls() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const {
    isPiPActive,
    isSupported,
    error,
    pipWindow,
    enterPiP,
    exitPiP,
    toggle,
  } = usePictureInPictureApi(videoRef);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnterPiPAndPlay = async () => {
    if (videoRef.current) {
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
      await enterPiP();
    }
  };

  // Listen for video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <div>
      <video 
        ref={videoRef} 
        src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        width="600"
        height="400"
        onLoadedMetadata={() => console.log("Video loaded")}
      />
      
      <div style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <strong>Video Status:</strong> {isPlaying ? "Playing" : "Paused"}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>PiP Status:</strong> {isPiPActive ? "Active" : "Inactive"}
        </div>
        {pipWindow && (
          <div style={{ marginBottom: "10px" }}>
            <strong>PiP Window:</strong> {pipWindow.width}×{pipWindow.height}px
          </div>
        )}
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            <strong>Error:</strong> {error.message}
          </div>
        )}
        
        <div>
          <button onClick={handlePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={handleEnterPiPAndPlay} disabled={!isSupported || isPiPActive}>
            Play in PiP
          </button>
          <button onClick={exitPiP} disabled={!isPiPActive}>
            Exit PiP
          </button>
          <button onClick={toggle} disabled={!isSupported}>
            Toggle PiP
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Arguments

| Argument | Type                             | Description                                          |
| -------- | -------------------------------- | ---------------------------------------------------- |
| videoRef | RefObject\<HTMLVideoElement\>    | React ref object pointing to the video element      |

### Return

| Return value | Type                                | Description                                                        |
| ------------ | ----------------------------------- | ------------------------------------------------------------------ |
| isPiPActive  | boolean                             | Whether the video is currently in Picture-in-Picture mode         |
| isSupported  | boolean                             | Whether Picture-in-Picture is supported by the browser and video  |
| error        | Error \| null                       | Current error state, if any                                       |
| pipWindow    | PictureInPictureWindow \| null      | Reference to the Picture-in-Picture window, if active             |
| enterPiP     | () => Promise\<void\>               | Function to enter Picture-in-Picture mode                         |
| exitPiP      | () => Promise\<void\>               | Function to exit Picture-in-Picture mode                          |
| toggle       | () => Promise\<void\>               | Function to toggle Picture-in-Picture mode                        |

---