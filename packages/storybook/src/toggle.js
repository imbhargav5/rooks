import React, { useState, useRef } from "react";
import { storiesOf } from "@storybook/react";
import useToggle from "@rooks/use-toggle";
import README from "@rooks/use-toggle/README.md";

storiesOf("useToggle", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <ToggleDemo />);

const customToggleFunction = v => (v === "start" ? "stop" : "start");

function ToggleDemo() {
  const [value1, toggleValue1] = useToggle();
  const [value2, toggleValue2] = useToggle(true);
  const [value3, toggleValue3] = useToggle("start", customToggleFunction);

  return (
    <>
      <section>
        <h3>Base</h3>
        <button onClick={toggleValue1}>{value1.toString()}</button>
        <hr />
      </section>
      <section>
        <h3>Initial true</h3>
        <button onClick={toggleValue2}>{value2.toString()}</button>
        <hr />
      </section>
      <section>
        <h3>Custom values</h3>
        <button onClick={toggleValue3}>{value3}</button>
      </section>
    </>
  );
}
