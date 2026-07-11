---
id: useOnline
title: useOnline
sidebar_label: useOnline
---

## About

Online status hook for React.

### Examples

```jsx
import "./styles.css";
import { useOnline } from "rooks";

function App() {
  const online = useOnline();
  console.log("I'm online");

  return (
    <div>
      <h1>Rooks: useOnline example</h1>

      <hr></hr>
      <div style={{ backgroundColor: "lightblue" }}>
        Status:You are {online ? "Online" : "Offline"}
      </div>
    </div>
  );
}

export default App;
```

### Return value

Offline status (boolean) is returned.

## Robustness and lifecycle

The hook returns `null` during server rendering, then reports `navigator.onLine` after hydration. Online and offline listeners are removed when the last component instance unmounts.
