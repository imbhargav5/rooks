import React, { useState, useRef } from "react";
import { storiesOf } from "@storybook/react";
import useOutsideClickRef from "@rooks/use-outside-click-ref";
import README from "@rooks/use-outside-click-ref/README.md";

storiesOf("useOutsideClickRef", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <UseOutsideClickRefDemo />);

function UseOutsideClickRefDemo() {
  function outsidePClick() {
    alert("Clicked outside.");
  }
  const [pRef] = useOutsideClickRef(outsidePClick);
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
