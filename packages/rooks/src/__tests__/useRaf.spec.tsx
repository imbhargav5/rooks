import { render } from "@testing-library/react";
import React, { useRef } from "react";
import { useRaf } from "../hooks/useRaf";

describe("useRaf", () => {
  let TestJSX = () => <canvas />;
  let angle = 0;
  function updateAngle() {
    angle = (angle + 2) % 360;
    return (angle * Math.PI) / 180;
  }

  const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useRaf(() => {
      if (canvasRef.current) {
        const screenRatio = window.devicePixelRatio || 1;
        const angle2 = updateAngle();
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
          context.save();
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.scale(screenRatio, screenRatio);
          context.fillStyle = "midnightblue";
          context.globalAlpha = 1;
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = "yellow";
          context.lineWidth = 2;
          context.translate(50, 50);
          context.rotate(angle2);
          context.fillRect(-20, -20, 40, 40);
          context.restore();
        }
      }
    }, true);
    return (
      <canvas
        ref={canvasRef}
        style={{ background: "grey", height: `100px`, width: `100%` }}
      />
    );
  };

  beforeEach(() => {
    TestJSX = App;
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useRaf).toBeDefined();
  });

  it("should render", () => {
    expect.hasAssertions();
    const { container } = render(<TestJSX />);
    expect(container).toBeDefined();
  });
});
