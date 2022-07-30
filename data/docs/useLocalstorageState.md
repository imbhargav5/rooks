---
id: useLocalstorageState
title: useLocalstorageState
sidebar_label: useLocalstorageState
---

## About

UseState but auto updates values to localStorage

[//]: # "Main"

## Examples

```jsx
import "./styles.css";
import React from "react";
import { useLocalstorageState } from "rooks";

export default function App() {
  const [count, setCount] = useLocalstorageState("my-app:count", 0);

  return (
    <div className="App">
      <h1>Rooks : useLocalstorageState</h1>
      <p> Refresh the page to see the previous value in tact</p>
      <button onClick={() => setCount(0)}>clear</button>
      <button onClick={() => setCount(count + 1)}>Click me {count}</button>
    </div>
  );
}
```

### Arguments

| Argument value | Type   | Description                    | Defualt   |
| -------------- | ------ | ------------------------------ | --------- |
| key            | string | Key of the localStorage object | undefined |
| defaultValue   | any    | Default initial value          | null      |

### Returns

Returns an array of following items:

| Return value | Type     | Description                         |
| ------------ | -------- | ----------------------------------- |
| value        | any      | value stored in localStorage        |
| set          | Function | set value stored in localStorage    |
| remove       | Function | remove value stored in localStorage |
