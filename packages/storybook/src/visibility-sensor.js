import React, { useState, useRef } from "react";
import { storiesOf } from "@storybook/react";
import useVisibilitySensor from "@rooks/use-visibility-sensor";

storiesOf("useVisibilitySensor", module).add("basic example", () => (
  <VisibilitySensorDemo />
));

function VisibilitySensorDemo() {
  const rootNode = useRef(null);
  const { isVisible, visibilityRect } = useVisibilitySensor(rootNode, {
    intervalCheck: false,
    scrollCheck: true,
    resizeCheck: true
  });
  return (
    <div>
      <h1> Scroll to see changes </h1>
      <p
        style={{
          marginTop: "300px"
        }}
        ref={rootNode}
      >
        {isVisible ? "Visible" : isVisible === null ? "Null" : "Not Visible"}
      </p>
      <pre>
        {visibilityRect ? JSON.stringify(visibilityRect, null, 2) : null}
      </pre>
    </div>
  );
}
