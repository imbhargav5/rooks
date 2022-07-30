---
id: useOutsideClick
title: useOutsideClick
sidebar_label: useOutsideClick
---

## About

Outside click event (for a ref) as a React hook.

## Examples

```jsx
import { useOutsideClick } from "rooks";
import { useRef } from "react";

function App() {
  const ref = useRef();
  function myComponent() {
    alert("Clicked outside");
  }
  useOutsideClick(ref, myComponent);

  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks : useOutsideClick Example</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          backgroundColor: "lightblue",
        }}
        ref={ref}
      >
        <h2 className="inside">This is inside</h2>
      </div>
    </div>
  );
}

export default App;
```

### Arguments

| Arguments | Type                   | Description                                                                                                | Default value |
| --------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- | ------------- |
| ref       | React.MutableRefObject | Ref whose outside click needs to be listened to                                                            |               |
| handler   | function               | Callback to fire on outside click                                                                          |               |
| when      | boolean                | A boolean which activates the hook only when it is true. Useful for conditionally enable the outside click | true          |

### Returns

No return value.
