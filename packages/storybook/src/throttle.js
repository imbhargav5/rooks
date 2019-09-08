import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import useThrottle from "@rooks/use-throttle";
import README from "@rooks/use-throttle/README.md";

storiesOf("useThrottle", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <ThrottleDemo />)
  .add("example with arguments", () => <ThrottleWithArgumentsDemo />);

function ThrottleDemo() {
  const [number, setNumber] = useState(0);
  const addNumber = () => setNumber(number + 1);
  const addNumberThrottled = useThrottle(addNumber, 1000);
  return (
    <>
      <h1>Number: {number}</h1>
      <p>Click really fast.</p>
      <button onClick={addNumber}>Add number</button>
      <button onClick={addNumberThrottled}>Add number throttled</button>
    </>
  );
}

function ThrottleWithArgumentsDemo() {
  const [number, setNumber] = useState(0);
  const [argumentNumber, setArgumentNumber] = useState(0);

  const addNumber = (argNumber) => {
    setArgumentNumber(argNumber * Math.random());
    setNumber(number + 1)
  };
  const addNumberThrottled = useThrottle(() => addNumber(5), 1000);
  return (
    <>
      <h1>Number: {number}</h1>
      <h2>Number passed in argument: {argumentNumber}</h2>
      <button onClick={() => addNumber(5)}>Add number</button>
      <button onClick={addNumberThrottled}>Add number throttled</button>
    </>
  );
}
