---
id: useDidMount
title: useDidMount
sidebar_label: useDidMount
---

## About

componentDidMount hook for React
<br/>

## Examples

```jsx
import { useDidMount } from "rooks";
export default function App() {
  useDidMount(function() {
    console.log("mounted");
  });
  return null;
}
```

## Arguments

| Argument | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| callback | function | function to be called on mount |

---
