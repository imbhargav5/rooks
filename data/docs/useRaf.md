---
id: useRaf
title: useRaf
sidebar_label: useRaf
---

## About

A continuously running requestAnimationFrame hook for React

## Examples

### Basic example

```jsx
import React, { useRef } from "react";
import "./styles.css";
import { useRaf, useToggle } from "rooks";

let angle = 0;
function updateAngle() {
  angle = (angle + 2) % 360;
  return (angle * Math.PI) / 180;
}

export default function App() {
  const [shouldRun, toggleShouldRun] = useToggle(true);
  const canvasRef = useRef();
  useRaf(() => {
    if (canvasRef && canvasRef.current) {
      const screenRatio = window.devicePixelRatio || 1;
      let angle = updateAngle();
      const canvas = canvasRef.current;
      var ctx = canvas.getContext("2d");
      ctx.save();
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.scale(screenRatio, screenRatio);
      ctx.fillStyle = "midnightblue";
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.fillStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.translate(50, 50);
      ctx.rotate(angle);
      ctx.fillRect(-20, -20, 40, 40);
      ctx.restore();
    }
  }, shouldRun);

  return (
    <>
      <h2>
        Request animation frame is now {shouldRun ? "" : "in"}active. Click to
        toggle.
      </h2>
      <p>
        <button onClick={toggleShouldRun}>Toggle Raf</button>{" "}
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: `100px`, width: `100%`, background: "grey" }}
      />
    </>
  );
}
```

### Arguments

| Argument value | Type                            | Description                                                                                  | Default value |
| -------------- | ------------------------------- | -------------------------------------------------------------------------------------------- | ------------- |
| callback       | `(timeElapsed: number) => void` | The callback function to be executed. timeElapsed is the time in ms since the last raf call. | undefined     |
| isActive       | boolean                         | The value which while true, keeps the raf running infinitely                                 | undefined     |

### Returns

No return value.
