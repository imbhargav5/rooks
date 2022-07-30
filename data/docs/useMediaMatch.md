---
id: useMediaMatch
title: useMediaMatch
sidebar_label: useMediaMatch
---

## About

Signal whether or not a media query is currently matched.

[//]: # "Main"

## Examples

```jsx
import "./styles.css";
import { useMediaMatch } from "rooks";

function App() {
  const Component = useMediaMatch("(max-width: 600px)");

  return (
    <div>
      <h1>Rooks : useMediaMatch example</h1>
      <hr></hr>

      <div
        style={{
          backgroundColor: "lightblue",
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span>Your screen is {Component ? "narrow" : "wide"}</span>
      </div>
    </div>
  );
}

export default App;
```

### Arguments

| Argument value | Type   | Description                                                                                                              |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| query          | string | The media query to signal on. Example, `"print"` will signal `true` when previewing in print mode, and `false` otherwise |

### Returns

| Return value | Type    | Description                                         |
| ------------ | ------- | --------------------------------------------------- |
| isMatch      | Boolean | Whether or not the media query is currently matched |

---
