import React, { useState, useRef, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useBoundingclientrect from "@rooks/use-boundingclientrect";
import README from "@rooks/use-boundingclientrect/README.md";

storiesOf("useBoundingclientrect", module)
  .addParameters({
    readme: {
      sidebar: README,
    },
  })
  .add("basic example", () => <BoundingClientRectDemo />, {
    info: README,
  });

function BoundingClientRectDemo() {
  const myRef = useRef();
  const [getBoundingClientRect, update] = useBoundingclientrect(myRef);
  const [XOffset, setXOffset] = useState(0);
  const [YOffset, setYOffset] = useState(300);
  const displayString = JSON.stringify(getBoundingClientRect, null, 2);

  // update the clientRect when window resized
  useEffect(() => {
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <div
        style={{
          width: "20vw",
          background: "lightblue",
          padding: "10px",
          position: "absolute",
          left: XOffset,
          top: YOffset,
        }}
        ref={myRef}
      >
        <div
          style={{
            resize: "both",
            overflow: "auto",
            background: "white",
            color: "blue",
            maxWidth: "100%",
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
