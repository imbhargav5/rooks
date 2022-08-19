---
id: useFullscreen
title: useFullscreen
sidebar_label: useFullscreen
---

## About

Use [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) to make beautiful and immersive experience. Present desired content using the entire user's screen. Commonly used in browser games or other applications using canvases.

## Example

```tsx
import React, { useRef } from "react";
import { useFullscreen } from "rooks";

export default function UseFullscreenTest() {
  const fullscreenContainerRef = useRef<Element>(null);
  const {
    isFullscreenAvailable,
    isFullscreenEnabled,
    toggleFullscreen,
  } = useFullscreen({ target: fullscreenContainerRef });

  return (
    <>
      <div ref={fullscreenContainerRef}>
        {isFullscreenAvailable ? (
          <button onClick={toggleFullscreen}>
            {isFullscreenEnabled ? 'Disable fullscreen' : 'Enable fullscreen'}
          </button>
        ) : (
          <p>Fullscreen API is not available.</p>
        )}
      </div>
      <div>
       <p>Other content which won't be visible while in fullscreen mode...</p>
      </div>
    </>
  );
}
```

### Arguments

An object with the following optional properties:

| Argument value                   | Type                       | Description                                                                                                                          |
| -------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| options.target                   | `React.RefObject<Element>` | React's ref to DOM node which should be present in fullscreen mode                                                                   |
| options.onChange                 | `(event: Event) => void`   | Callback function to be called on `fullscreenchange` event                                                                           |
| options.onError                  | `(event: Event) => void`   | Callback function to be called on `fullscreenerror` event                                                                            |
| options.requestFullscreenOptions | `FullscreenOptions`        | `requestFullscreen` options as defined [here](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen#parameters) |

If the `target` property is not specified, the whole document will be rendered in fullscreen mode.

### Returns

Returns an object with following properties:

| Property Name         | Type                  | Description                                             |
| --------------------- | --------------------- | ------------------------------------------------------- |
| isFullscreenAvailable | `boolean`             | Whether the `Fullscreen API` is available               |
| isFullscreenEnabled   | `boolean`             | Whether the fullscreen is enabled                       |
| fullscreenElement     | `Element | null`      | The currently rendered fullscreen element, null if none |
| enableFullscreen      | `() => Promise<void>` | Enable the fullscreen                                   |
| disableFullscreen     | `() => Promise<void>` | Disable the fullscreen                                  |
| toggleFullscreen      | `() => Promise<void>` | Toggle the fullscreen                                   |

#### Sidenote

- Before using Fullscreen API, one should check if it is available using `isFullscreenAvailable` property. Otherwise, all method calls will result in an error. 
- If the target is an `<iframe>`, it must have the `allowfullscreen` attribute applied to it.
- All methods should be called while responding to a user interaction or a device orientation change. Otherwise, such operations will result in an error (eg., you cannot enable the fullscreen on component render using the `useEffect` hook).
