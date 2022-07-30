---
id: usePreviousDifferent
title: usePreviousDifferent
sidebar_label: usePreviousDifferent
---

## About

usePreviousDifferent returns the last different value of a variable

[//]: # "Main"

## Examples

```jsx
import { usePreviousDifferent, useCounter } from "rooks";

function App() {
  const { value: counter1Value, increment: incrementCounter1 } = useCounter(0);
  const previousCounter1Value = usePreviousDifferent(counter1Value);
  const { value: counter2Value, increment: incrementCounter2 } = useCounter(0);
  const previousCounter2Value = usePreviousDifferent(counter2Value);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks : usePreviousDifferent example </h1>
      <p>
        Notice how previously different values are tracked across rerenders and
        when other values change.
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

### Arguments

| Arguments    | Type | Description                                                    | Default value |
| ------------ | ---- | -------------------------------------------------------------- | ------------- |
| currentValue | T    | The variable whose previously different value is to be tracked | undefined     |

### Return

| Returned value | Type | Description                                                     |
| -------------- | ---- | --------------------------------------------------------------- |
| previousValue  | T    | returns the past value which was different from the current one |

---
