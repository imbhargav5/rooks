---
id: useWindowEventListener
title: useWindowEventListener
sidebar_label: useWindowEventListener
---

## About

Adds an event listener to window

[//]: # "Main"

## Examples

### Basic usage

```jsx
import { useState } from "react";
import { useWindowEventListener } from "rooks";
import "./styles.css";

export default function App() {
  const [value, setValue] = useState(0);
  useWindowEventListener("click", function() {
    setValue(value + 1);
  });
  return (
    <div
      className="App"
      style={{
        padding: "20px",
      }}
    >
      <h2>Click anywhere</h2>
      <p> Value is {value}</p>
    </div>
  );
}
```

---
