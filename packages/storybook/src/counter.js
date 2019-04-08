import React from "react";
import { storiesOf } from "@storybook/react";
import useCounter from "@rooks/use-counter";

function CounterComponent() {
  const {
    value,
    increment,
    decrement,
    incrementBy,
    decrementBy,
    reset
  } = useCounter(3);

  function incrementBy5() {
    incrementBy(5);
  }
  function decrementBy7() {
    decrementBy(7);
  }

  return (
    <>
      <h1>Current value is {value}</h1>
      <br />
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
      <button onClick={incrementBy5}>incrementBy5</button>
      <button onClick={decrementBy7}>decrementBy7</button>
      <button onClick={reset}>reset</button>
    </>
  );
}

storiesOf("useCounter", module).add("basic example", () => (
  <CounterComponent />
));
