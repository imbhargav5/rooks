---
id: use-raf
title: use-raf
sidebar_label: use-raf
---

   

## About

A continuously running requestAnimationFrame hook for React
<br/>

[![Image from Gyazo](https://i.gyazo.com/8c7393678112dc0cee575cbff570096d.gif)](https://gyazo.com/8c7393678112dc0cee575cbff570096d)

## Installation

    npm install --save @rooks/use-raf

## Importing the hook

```javascript
import useRaf from "@rooks/use-raf";
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


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    