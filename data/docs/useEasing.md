---
id: useEasing
title: useEasing
sidebar_label: useEasing
---

## About

A hook for creating controlled easing animations with start/stop/reset capabilities.
<br/>

## Examples

```jsx
import React from "react";
import { useEasing, Easing } from "rooks";

export default function App() {
  const [progress, { start, stop, reset, state }] = useEasing(1000, {
    easing: Easing.easeInOutQuad,
    autoStart: false,
  });

  return (
    <>
      <div style={{
        width: 100,
        height: 100,
        background: 'blue',
        transform: `translateX(${progress * 200}px)`
      }} />
      <hr />
      <button onClick={start} disabled={state === "running"}>Start</button>
      <button onClick={stop} disabled={state === "idle"}>Stop</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}
```

### Arguments

| Argument | Type             | Description                               |
| -------- | ---------------- | ----------------------------------------- |
| duration | number           | Duration of the animation in milliseconds |
| options  | UseEasingOptions | Configuration options                     |

### Return

| Return value | Type                  | Description                                                       |
| ------------ | --------------------- | ----------------------------------------------------------------- |
| progress     | number                | Current eased progress value (0 to 1)                             |
| controls     | EasingControls        | Object containing \{start, stop, reset, restart, state, direction, endCount\} |

---
