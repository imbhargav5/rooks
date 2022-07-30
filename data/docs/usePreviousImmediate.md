---
id: usePreviousImmediate
title: usePreviousImmediate
sidebar_label: usePreviousImmediate
---

## About

usePreviousImmediate returns the previous value of a variable even if it was the same or different

[//]: # "Main"

## Examples

```jsx
import { usePreviousImmediate, useCounter } from "rooks";

function App() {
  const { value: counter1Value, increment: incrementCounter1 } = useCounter(0);
  const previousCounter1Value = usePreviousImmediate(counter1Value);
  const { value: counter2Value, increment: incrementCounter2 } = useCounter(0);
  const previousCounter2Value = usePreviousImmediate(counter2Value);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks : usePreviousImmediate example </h1>
      <p>
        This simply gives the value of a state variable in the previous render.
      </p>
      <div>
        <p>Counter: {String(counter1Value)}</p>
        <p>Previous Counter 1 value: {String(previousCounter1Value)}</p>
        <p>Counter: {String(counter2Value)}</p>
        <p>Previous Counter 1 value: {String(previousCounter2Value)}</p>
        <button onClick={incrementCounter1}>Increment counter 1</button>
        <br />
        <button onClick={incrementCounter2}>Increment counter 2</button>
      </div>
    </div>
  );
}

export default App;
```

---

## Codesandbox Examples

### Basic Usage
