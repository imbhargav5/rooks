---
id: useAudio
title: useAudio
sidebar_label: useAudio
---

## About

A hook to control and manage audio elements in your React application.

[//]: # "Main"

## Examples

#### Basic example

```jsx
import { useAudio } from "rooks";

export default function App() {
  const audioSrc = "https://example.com/audio.mp3";
  const [{ isPlaying, isMuted }, audioRef] = useAudio({ autoPlay: false });

  const handlePlay = () => audioRef.current.play();
  const handlePause = () => audioRef.current.pause();
  const handleToggleMute = () => (audioRef.current.muted = !isMuted);

  return (
    <>
      <audio ref={audioRef} src={audioSrc} />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleToggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
    </>
  );
}
```

### Arguments

| Argument value | Type   | Description     | Default |
| -------------- | ------ | --------------- | ------- |
| options        | Object | See table below | {}      |

| Options value | Type    | Description                                               | Default |
| ------------- | ------- | --------------------------------------------------------- | ------- |
| autoPlay      | Boolean | Indicates if the audio should start playing automatically | false   |
| isMuted       | Boolean | Indicates if the audio should be muted by default         | false   |

### Returns

| Return value | Type         | Description                                                        | Default   |
| ------------ | ------------ | ------------------------------------------------------------------ | --------- |
| state        | Object       | An object containing isPlaying and isMuted properties              | {}        |
| ref          | Callback Ref | A ref that should be used on the audio element you want to control | undefined |
