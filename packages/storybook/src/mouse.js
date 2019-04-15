import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useMouse from "@rooks/use-mouse";
import README from "@rooks/use-mouse/README.md";

storiesOf("useMouse", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <MouseDemo />);

function MouseDemo() {
  const {
    screenX,
    screenY,
    movementX,
    movementY,
    pageX,
    pageY,
    clientX,
    clientY,
    offsetX,
    offsetY
  } = useMouse();
  return (
    <>
      <h1> Move mouse here to see changes to position </h1>
      <p>screenX position is {screenX || "null"}</p>
      <p>screenY position is {screenY || "null"}</p>
      <p>movementX position is {movementX || "null"}</p>
      <p>movementY position is {movementY || "null"}</p>
      <p>pageX position is {pageX || "null"}</p>
      <p>pageY position is {pageY || "null"}</p>
      <p>clientX position is {clientX || "null"}</p>
      <p>clientY position is {clientY || "null"}</p>
      <p>offsetX position is {offsetX || "null"}</p>
      <p>offsetY position is {offsetY || "null"}</p>
    </>
  );
}
