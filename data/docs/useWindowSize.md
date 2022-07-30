---
id: useWindowSize
title: useWindowSize
sidebar_label: useWindowSize
---

## About

Window size hook for React.
<br/>

## Examples

### Basic usage

```jsx
import "./styles.css";
import { useWindowSize } from "rooks";

function App() {
  const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize();

  return (
    <div>
      <h1>Rooks: useWindowSize Example</h1>
      <hr></hr>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "skyBlue",
        }}
      >
        <p>
          <span>innerHeight - </span>
          <span>{innerHeight}</span>
        </p>
        <p>
          <span>innerWidth - </span>
          <span>{innerWidth}</span>
        </p>
        <p>
          <span>outerHeight - </span>
          <span>{outerHeight}</span>
        </p>
        <p>
          <span>outerWidth - </span>
          <span>{outerWidth}</span>
        </p>
      </div>
    </div>
  );
}

export default App;
```

### Returned Object keys

| Returned object attributes | Type | Description            |
| -------------------------- | ---- | ---------------------- |
| width                      | int  | inner width of window  |
| height                     | int  | inner height of window |
| outerWidth                 | int  | outer height of window |
| outerHeight                | int  | outer width of window  |
