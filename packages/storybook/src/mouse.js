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
    target,
    position: {
      screen: { x: screenX, y: screenY },
      client: { x: clientX, y: clientY },
      page: { x: pageX, y: pageY },
      offset: { x: offsetX, y: offsetY }
    },
    movement: { x: movementX, y: movementY },
    buttons: { left, right, middle },
    keyboard: { alt, ctrl, meta, shift }
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

      <h1> Use mouse buttons to see how they register </h1>
      <p>left is {left ? "true" : "false"}</p>
      <p>right is {right ? "true" : "false"}</p>
      <p>middle is {middle ? "true" : "false"}</p>

      <h1> Modifier keys </h1>
      <p>alt is {alt ? "true" : "false"}</p>
      <p>ctrl is {ctrl ? "true" : "false"}</p>
      <p>meta is {meta ? "true" : "false"}</p>
      <p>shift is {shift ? "true" : "false"}</p>

      <h1> Target </h1>
      <p>target innerHTML is {target && target.innerHTML}</p>
    </>
  );
}
