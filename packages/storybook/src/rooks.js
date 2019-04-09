import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import {
  useInput,
  useCounter,
  useDidMount,
  useInterval,
  useToggle
} from "rooks";

storiesOf("rooks", module).add("basic example", () => <RooksDemo />);

function RooksDemo() {
  const [hasMagicStarted, setHasMagicStarted] = useToggle(false);
  const [toggle1, setToggle1] = useToggle(false);

  const { value: counter, increment } = useCounter(5);

  const { start, stop } = useInterval(() => {
    setToggle1();
    increment();
  }, 100);

  useEffect(() => {
    if (hasMagicStarted) {
      start();
    } else {
      stop();
    }
  }, [hasMagicStarted]);

  return (
    <>
      <div>
        <fieldset>
          <label htmlFor="magic">Start magic</label>
          <input
            id="magic"
            type="checkbox"
            checked={hasMagicStarted}
            onChange={setHasMagicStarted}
          />
        </fieldset>
      </div>
      <input type="checkbox" checked={toggle1} />
      <br />
      <p>Counter value is {counter}</p>
    </>
  );
}
