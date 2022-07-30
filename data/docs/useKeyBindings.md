---
id: useKeyBindings
title: useKeyBindings
sidebar_label: useKeyBindings
---

## About

useKeyBindings can bind pairs of keyboard events and handlers.

[//]: # "Main"

## Examples

```jsx
import "./styles.css";
import { useKeyBindings, useCounter } from "rooks";

export default function App() {
  const { value, increment, incrementBy, decrementBy, reset } = useCounter(0);
  const cb1 = () => increment();
  const cb2 = () => decrementBy(3);
  const cb3 = () => incrementBy(5);
  const cb4 = () => reset();

  useKeyBindings({ a: cb1, b: cb2, Enter: cb3, Escape: cb4 });

  return (
    <div>
      <p>
        Counter value is : <strong>{value}</strong>
      </p>
    </div>
  );
}
```

### Arguments

| Argument    | Type    | Description                           | Default value |
| ----------- | ------- | ------------------------------------- | ------------- |
| keyBindings | Object  | pairs of keyboard events and handlers | {}            |
| options     | Options | refer to useKey                       | {}            |
