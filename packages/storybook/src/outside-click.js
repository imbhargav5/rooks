import React, { useState, useRef } from "react";
import { storiesOf } from "@storybook/react";
import useOutsideClick from "@rooks/use-outside-click";
import README from "@rooks/use-outside-click/README.md";

storiesOf("useOutsideClick", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <UseOutsideClickDemo />);

function UseOutsideClickDemo() {
  const pRef = useRef();
  function outsidePClick() {
    alert("Clicked outside.");
  }
  useOutsideClick(pRef, outsidePClick);
  return (
    <div>
      <span
        ref={pRef}
        style={{
          width: 300,
          height: 100,
          display: "inline-block",
          background: "royalblue",
          margin: 40,
          padding: 10
        }}
      >
        Click outside me
      </span>
    </div>
  );
}
