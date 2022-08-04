---
id: useFocusWithin
title: useFocusWithin
sidebar_label: useFocusWithin
---

## About

Handles focus events for the target component.

## Examples

```jsx
import { useFocusWithin } from "rooks";
import React from "react";

export default function App() {
  const [isFocusWithin, setFocusWithin] = React.useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: (e) => console.log("focus within"),
    onBlurWithin: (e) => console.log("blur within"),
    onFocusWithinChange: (isFocusWithin) => setFocusWithin(isFocusWithin),
  });

  return (
    <div
      {...focusWithinProps}
      style={{
        background: isFocusWithin ? "goldenrod" : "",
        color: isFocusWithin ? "black" : "",
      }}
    >
      <label>
        First Name: <input />
      </label>
      <label>
        Last Name: <input />
      </label>
    </div>
  );
}
```
