/**
 * @jest-environment jsdom
 */
import { render, cleanup, act, getByTestId } from "@testing-library/react";
import React, { useState } from "react";
import { useResizeObserverRef } from "../hooks/useResizeObserverRef";

describe("useResizeObserverRef", () => {
  let App;
  beforeEach(() => {
    App = () => {
      const [resizeCount, setResizeCount] = useState(0);
      const incrementResizeCount = () => {
        return setResizeCount(resizeCount + 1);
      };
      const [myRef] = useResizeObserverRef(incrementResizeCount);
      const [XOffset, setXOffset] = useState(0);
      const [YOffset, setYOffset] = useState(300);
      return (
        <>
          <div
            style={{
              width: 300,
              background: "lightblue",
              padding: "10px",
              position: "absolute",
              left: XOffset,
              top: YOffset,
            }}
          >
            <div
              style={{
                resize: "both",
                overflow: "auto",
                background: "white",
                color: "blue",
                maxWidth: "100%",
              }}
              ref={myRef}
              data-testid="app"
            >
              <p>
                Resize this div as you see fit. To demonstrate that it also
                updates on child dom nodes resize
              </p>
            </div>
            <h2>Bounds</h2>
            <p>
              <button onClick={() => setXOffset(XOffset - 5)}>
                {" "}
                Move Left{" "}
              </button>
              <button onClick={() => setXOffset(XOffset + 5)}>
                {" "}
                Move Right{" "}
              </button>
            </p>
            <p>
              <button onClick={() => setYOffset(YOffset - 5)}> Move Up </button>
              <button onClick={() => setYOffset(YOffset + 5)}>
                {" "}
                Move Down{" "}
              </button>
            </p>
          </div>
          <div style={{ height: 500 }}>
            <pre data-testid="message">Resize count: {resizeCount}</pre>
          </div>
        </>
      );
    };
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect(useResizeObserverRef).toBeDefined();
  });
});
