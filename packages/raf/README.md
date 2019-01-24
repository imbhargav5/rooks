# @rooks/use-raf

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

## A continuously running requestAnimationFrame hook for React

[![Image from Gyazo](https://i.gyazo.com/8c7393678112dc0cee575cbff570096d.gif)](https://gyazo.com/8c7393678112dc0cee575cbff570096d)

### Installation

```
npm install --save @rooks/use-raf
```

### Usage

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
