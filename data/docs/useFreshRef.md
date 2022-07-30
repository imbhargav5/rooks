---
id: useFreshRef
title: useFreshRef
sidebar_label: useFreshRef
---

## About

Avoid stale state in callbacks with this hook. Auto updates values using a ref.

[//]: # "Main"

## Examples

```jsx
import "./styles.css";
import { useFreshRef } from "rooks";
import { useState, useEffect } from "react";

export default function App() {
  const [value, setValue] = useState(0);
  function increment() {
    setValue(value + 1);
    console.log("here");
  }
  const freshIncrementRef = useFreshRef(increment);

  useEffect(() => {
    function tick() {
      freshIncrementRef.current();
    }
    const intervalId = setInterval(tick, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="App">
      <h1>useFreshRef example</h1>
      <h2>value: {value}</h2>
    </div>
  );
}
```

### Arguments

| Argument value     | Type    | Description                                                                               |
| ------------------ | ------- | ----------------------------------------------------------------------------------------- |
| value              | T       | The value which needs to be fresh at all times. Probably best used with functions         |
| preferLayoutEffect | boolean | Should the value be updated using a layout effect or a passive effect. Defaults to false. |

### Returns

| Return value | Type      | Description                      | Default value |
| ------------ | --------- | -------------------------------- | ------------- |
| ref          | RefObject | A ref containing the fresh value | () => null    |

---
