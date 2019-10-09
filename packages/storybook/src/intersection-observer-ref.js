import React, { useState, useRef } from "react";
import { storiesOf } from "@storybook/react";
import useIntersectionObserverRef from "@rooks/use-intersection-observer-ref";
import README from "@rooks/use-intersection-observer-ref/README.md";
import { String } from "core-js";

storiesOf("useIntersectionObserverRef", module)
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
  const [myRef] = useIntersectionObserverRef(callback);
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
      </div>
      <div style={{ height: 2000 }}></div>
      <div ref={myRef} style={{ height: 300, background: "red" }}></div>
      <div style={{ height: 2000 }}></div>
    </>
  );
}
