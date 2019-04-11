import React from "react";
import { storiesOf } from "@storybook/react";
import useTimeout from "@rooks/use-timeout";

storiesOf("useTimeout", module).add("basic example", () => <UseTimeoutDemo />);

function UseTimeoutDemo() {
  function doAlert() {
    window.alert("timeout expired!");
  }
  const { start, clear, isActive } = useTimeout(doAlert, 2000);
  return (
    <>
      <button onClick={start}> Start timeout </button>
      <button onClick={clear}> Clear timeout </button>
      <p> {isActive ? "timeout is active" : "timeout is inactive"} </p>
    </>
  );
}
