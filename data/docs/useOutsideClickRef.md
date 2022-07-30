---
id: useOutsideClickRef
title: useOutsideClickRef
sidebar_label: useOutsideClickRef
---

## About

A hook that can track a click event outside a ref. Returns a callbackRef.

## Examples

```jsx
import "./styles.css";
import { useOutsideClickRef } from "rooks";

function App() {
  function myComponent() {
    alert("Clicked outside");
  }
  const [ref] = useOutsideClickRef(myComponent);
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

| Arguments | Type     | Description                                                                                                      | Default value |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------- | ------------- |
| handler   | function | Callback to fire on outside click                                                                                |               |
| when      | boolean  | A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click | true          |

### Returns

| Returned Array items | Type        | Description |
| -------------------- | ----------- | ----------- |
| ref                  | CallbackRef | ref         |
