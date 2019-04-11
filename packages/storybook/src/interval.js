import React, { useState, useEffect, useReducer } from "react";
import { storiesOf } from "@storybook/react";
import useInterval from "@rooks/use-interval";

storiesOf("UseIntervalDemo", module).add("basic example", () => (
  <UseIntervalDemo />
));

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      return state;
  }
}

function UseIntervalDemo() {
  const [value, dispatcher] = useReducer(reducer, { count: 0 });

  function increment() {
    dispatcher({
      type: "increment"
    });
  }

  const { start, stop } = useInterval(() => {
    increment();
  }, 1000);

  return (
    <>
      <p>value is {value.count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
