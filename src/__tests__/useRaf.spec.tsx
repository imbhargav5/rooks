import { render } from "@testing-library/react";
import { useRaf } from "../hooks/useRaf";
import React, { useRef } from "react";

describe("useRaf", () => {
  let TestJSX;
  let angle = 0;
  function updateAngle() {
    angle = (angle + 2) % 360;
    return (angle * Math.PI) / 180;
  }
  function App() {
    const canvasRef = useRef(null);
    useRaf(() => {
      if (canvasRef && canvasRef.current) {
        const screenRatio = window.devicePixelRatio || 1;
        let angle = updateAngle();
        const canvas: any = canvasRef.current;
        if (canvas) var ctx = canvas.getContext("2d");
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(screenRatio, screenRatio);
        ctx.fillStyle = "midnightblue";
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.translate(50, 50);
        ctx.rotate(angle);
        ctx.fillRect(-20, -20, 40, 40);
        ctx.restore();
      }
    }, true);
    return (
      <canvas
        ref={canvasRef}
        style={{ height: `100px`, width: `100%`, background: "grey" }}
      />
    );
  }
  beforeEach(() => {
    TestJSX = App;
  });

  it("should be defined", () => {
    expect(useRaf).toBeDefined();
  });

  it("should render", () => {
    const { container } = render(<TestJSX />);
    expect(container).toBeDefined();
  });
});
