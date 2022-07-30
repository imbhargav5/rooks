---
id: useOnWindowResize
title: useOnWindowResize
sidebar_label: useOnWindowResize
---

## About

A React hook for adding an event listener for window resize

## Examples

```jsx
import "./styles.css";
import { useOnWindowResize } from "rooks";

export default function App() {
  useOnWindowResize(() => console.log("window resized"));

  return (
    <div className="App">
      <h1>useOnWindowResize example</h1>
      <h2>Resize the window and see the logs</h2>
    </div>
  );
}
```

### Arguments

| Arguments      | Type     | Description                                     | Default value |
| -------------- | -------- | ----------------------------------------------- | ------------- |
| callback       | function | Callback function which needs to run on unmount | undefined     |
| when           | boolean  | When the event handler should be active         | true          |
| isLayoutEffect | boolean  | Should it use layout effect.                    | false         |

### Returns

No return value.
