---
id: useRefElement
title: useRefElement
sidebar_label: useRefElement
---

## About

Helps bridge gap between callback ref and state. Manages the element called with callback ref api using state variable.

## Examples

```jsx
import { useEffect, useState } from "react";
import { useRefElement } from "rooks";
import "./styles.css";

function useEventListenerRef(eventName, callback) {
  const [ref, element] = useRefElement();

  useEffect(() => {
    if (!(element && element.addEventListener)) {
      return;
    }
    element.addEventListener(eventName, callback);
    return () => {
      element.removeEventListener(eventName, callback);
    };
  }, [element, eventName, callback]);

  return ref;
}

export default function App() {
  const [value, setValue] = useState(0);
  const ref = useEventListenerRef("click", function() {
    setValue(value + 1);
  });

  return (
    <div
      ref={ref}
      className="App"
      style={{
        padding: "20px",
        border: "5px solid dodgerblue",
      }}
    >
      <h1>useRefElement Example</h1>
      <h2>Click in this box</h2>
      <p> Value is {value}</p>
    </div>
  );
}
```

### Arguments

No arguments.

### Returns an array of two items

| Returned items | Type                                        | Description                   |
| -------------- | ------------------------------------------- | ----------------------------- |
| ref            | `(refElement: RefElementOrNull<T>) => void` | The callback ref              |
| element        | `RefElementOrNull<T>`                       | The element linked to the ref |
