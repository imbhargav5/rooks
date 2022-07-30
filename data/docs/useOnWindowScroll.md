---
id: useOnWindowScroll
title: useOnWindowScroll
sidebar_label: useOnWindowScroll
---

## About

A React hook for adding an event listener for window scroll
<br/>

## Examples

```jsx
import "./styles.css";
import { useOnWindowScroll } from "rooks";

function App() {
  useOnWindowScroll(() => console.log("window scrolled"));
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks : useOnWindowScroll example</h1>
      <p>Scroll Down</p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "200px",
            height: "800px",
            backgroundColor: "teal",
            marginTop: "20px",
          }}
        ></div>
      </div>
      <p>Scroll Up</p>
    </div>
  );
}

export default App;
```

### Arguments

| Arguments      | Type     | Description                                     | Default value |
| -------------- | -------- | ----------------------------------------------- | ------------- |
| callback       | function | Callback function which needs to run on unmount | undefined     |
| when           | boolean  | When the event handler should be active         | true          |
| isLayoutEffect | boolean  | Should it use layout effect.                    | false         |

### Returns

No return value.
