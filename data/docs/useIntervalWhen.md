---
id: useIntervalWhen
title: useIntervalWhen
sidebar_label: useIntervalWhen
---

## About

Sets an interval immediately when a condition is true

[//]: # "Main"

## Examples

### Basic example

```jsx
import { useIntervalWhen } from "rooks";
import { useState } from "react";

function App() {
  const [value, setValue] = useState(0);
  const [when, setWhen] = useState(false);

  useIntervalWhen(
    () => {
      setValue(value + 1);
    },
    1000, // run callback every 1 second
    when // start the timer when it's true
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks: useIntervalWhen example</h1>
      <h2>Value: {value}</h2>
      <button onClick={() => setWhen(true)}> Start interval </button>
    </div>
  );
}

export default App;
```

### Fire callback instantly and not wait for first interval to finish

```jsx
import { useIntervalWhen } from "rooks";
import { useState } from "react";

function App() {
  const [value, setValue] = useState(0);
  const [when, setWhen] = useState(false);

  useIntervalWhen(
    () => {
      setValue(value + 1);
    },
    1000, // run callback every 1 second
    when, // start the timer when it's true
    true // no need to wait for the first interval
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks: useIntervalWhen example</h1>
      <p>
        Notice how the first increment is instantly after interval is enabled.
        If n intervals run, the callback fires n+1 times.
      </p>
      <h2>Value: {value}</h2>
      <button onClick={() => setWhen(true)}> Start interval </button>
    </div>
  );
}

export default App;
```

### Arguments

| Argument         | Type     | Description                                              | Default value |
| ---------------- | -------- | -------------------------------------------------------- | ------------- |
| callback         | function | Function be invoked after each interval duration         | undefined     |
| intervalDuration | number   | Duration in milliseconds after which callback is invoked | 0             |
| when             | boolean  | Only start timer when `when` is true                     | true          |
| startImmediate   | boolean  | Should the timer start immediately or no                 | false         |

### Returned Object

No return value.
