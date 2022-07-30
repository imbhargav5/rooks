---
id: useSessionstorageState
title: useSessionstorageState
sidebar_label: useSessionstorageState
---

## About

useState but syncs with sessionstorage

[//]: # "Main"

## Examples

```jsx
import "./styles.css";
import React from "react";
import { useSessionstorageState } from "rooks";

export default function App() {
  const [count, setCount] = useSessionstorageState("my-app:count", 0);

  return (
    <div className="App">
      <h1>Rooks : useSessionstorageState</h1>
      <p> Refresh the page to see the previous value in tact</p>
      <button onClick={() => setCount(0)}>clear</button>
      <button onClick={() => setCount(count + 1)}>Click me {count}</button>
    </div>
  );
}
```
