import React, { useState, useRef } from "react";
import { storiesOf } from "@storybook/react";
import useForkRef from "@rooks/use-fork-ref";
import useIntersectionObserverRef from "@rooks/use-intersection-observer-ref";
import useBoundingclientrectRef from "@rooks/use-boundingclientrect-ref";
import README from "@rooks/use-fork-ref/README.md";
import { String } from "core-js";

storiesOf("useForkRef", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <IntersectionObserverRefDemo />);

function IntersectionObserverRefDemo() {
  const [isVisible, setIsVisible] = useState(false);
  const callback = entries => {
    if (entries && entries[0]) {
      setIsVisible(entries[0].isIntersecting);
    }
  };
  const [myIntersectionObserverRef] = useIntersectionObserverRef(callback);
  const [
    myBoundingclientrectRef,
    boundingclientrect
  ] = useBoundingclientrectRef();
  const [XOffset, setXOffset] = useState(0);
  const [YOffset, setYOffset] = useState(300);
  const myRef = useForkRef(myIntersectionObserverRef, myBoundingclientrectRef);
  const displayString = JSON.stringify(boundingclientrect, null, 2);
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0
        }}
      >
        <h1>Is rectangle visible - {String(isVisible)}</h1>
        <pre>{displayString}</pre>
      </div>
      <div style={{ height: 2000 }}></div>
      <div
        ref={myRef}
        style={{
          height: 300,
          background: "lightblue",
          padding: "10px",
          position: "relative",
          left: XOffset,
          top: YOffset
        }}
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
      <div style={{ height: 2000 }}></div>
    </>
  );
}
