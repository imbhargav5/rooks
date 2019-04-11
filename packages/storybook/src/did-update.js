import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useDidUpdate from "@rooks/use-did-update";

function DidUpdateDemo() {
  const [value, setValue] = useState(0);
  const [hasUpdated, setHasUpdated] = useState(false);
  useDidUpdate(() => {
    alert("Update");
    setHasUpdated(true);
  }, [value]);
  return (
    <>
      <button onClick={() => setValue(value + 1)}>Value is {value}</button>
      <p>Has updated at least once - {hasUpdated.toString()}</p>
    </>
  );
}
storiesOf("useDidUpdate", module).add("basic example", () => <DidUpdateDemo />);
