import React, { useState, useRef } from "react";
import { storiesOf } from "@storybook/react";
import useBoundingclientrectRef from "@rooks/use-boundingclientrect-ref";
import README from "@rooks/use-boundingclientrect-ref/README.md";

storiesOf("useBoundingclientrectRef", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <BoundingClientRectRefDemo />, {
    info: README
  });

function BoundingClientRectRefDemo() {
  const [ref, boundingclientrect] = useBoundingclientrectRef();
  const [XOffset, setXOffset] = useState(0);
  const [YOffset, setYOffset] = useState(300);
  const displayString = JSON.stringify(boundingclientrect, null, 2);
  return (
    <>
      <div
        style={{
          width: 300,
          background: "lightblue",
          padding: "10px",
          position: "absolute",
          left: XOffset,
          top: YOffset
        }}
        ref={ref}
      >
        <div
          style={{
            resize: "both",
            overflow: "auto",
            background: "white",
            color: "blue",
            maxWidth: "100%"
          }}
        >
          <p>
            Resize this div as you see fit. To demonstrate that it also updates
            on child dom nodes resize
          </p>
        </div>
        <h2>Bounds</h2>
        <p>
          <button onClick={() => setXOffset(XOffset - 5)}> Move Left </button>
          <button onClick={() => setXOffset(XOffset + 5)}> Move Right </button>
        </p>
        <p>
          <button onClick={() => setYOffset(YOffset - 5)}> Move Up </button>
          <button onClick={() => setYOffset(YOffset + 5)}> Move Down </button>
        </p>
      </div>
      <div style={{ height: 500 }}>
        <pre>{displayString}</pre>
      </div>
    </>
  );
}
