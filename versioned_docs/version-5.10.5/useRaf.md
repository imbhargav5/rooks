---
id: useRaf
title: useRaf
sidebar_label: useRaf
---

## About

A continuously running requestAnimationFrame hook for React

[![Image from Gyazo](https://i.gyazo.com/8c7393678112dc0cee575cbff570096d.gif)](https://gyazo.com/8c7393678112dc0cee575cbff570096d)

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useRaf } from "rooks";
```

## Usage

```jsx
let angle = 0;
function updateAngle() {
  angle = (angle + 3) % 360;
  return (angle * Math.PI) / 180;
}

function Demo() {
  const { value: shouldRun, toggleValue: toggleShouldRun } = useToggle(true);
  const myRef = useRef();
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

render(<Demo />);
```


### Arguments

| Argument value | Type                            | Description                                                  | Default value |
|----------------|---------------------------------|--------------------------------------------------------------|---------------|
| callback       | `(timeElapsed: number) => void` | The callback function to be executed                         | undefined     |
| isActive       | boolean                         | The value which while true, keeps the raf running infinitely | undefined     |

### Returns

No return value.


## Codesandbox Examples

### Basic Usage

<iframe
  src="https://codesandbox.io/embed/useraf-1uxn0?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="useRaf usage"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>


## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
