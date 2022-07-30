---
id: useToggle
title: useToggle
sidebar_label: useToggle
---

## About

Toggle (between booleans or custom data)hook for React.

## Examples

### Basic usage

```jsx
import "./styles.css";
import { useToggle } from "rooks";

export default function App() {
  const [state, toggle] = useToggle();

  return (
    <div className="App">
      <h1>Rooks: useToggle Example </h1>
      <br></br>
      <button onClick={toggle} style={{ cursor: "pointer" }}>
        {state ? <span>Yes! 👍</span> : <span>No! 👎</span>}
      </button>
    </div>
  );
}
```

### With a Start value

```jsx
import "./styles.css";
import { useToggle } from "rooks";

export default function App() {
  const [state, toggle] = useToggle(true);

  return (
    <div className="App">
      <h1>Rooks: useToggle Example </h1>
      <br></br>
      <button onClick={toggle} style={{ cursor: "pointer" }}>
        {state ? <span>Yes! 👍</span> : <span>No! 👎</span>}
      </button>
    </div>
  );
}
```

### Custom toggle values

```jsx
import "./styles.css";
import { useToggle } from "rooks";

export default function App() {
  const [state, toggle] = useToggle("on", value =>
    value === "on" ? "off" : "on"
  );

  return (
    <div className="App">
      <h1>Rooks: useToggle Example </h1>
      <br></br>
      <button onClick={toggle} style={{ cursor: "pointer" }}>
        {state}
      </button>
    </div>
  );
}
```

## Arguments

| Arguments      | Type     | Description                                     | Default value |
| -------------- | -------- | ----------------------------------------------- | ------------- |
| initialValue   | boolean  | Initial value of the state                      | false         |
| toggleFunction | function | Function which determines how to toggle a value | v => !v       |

### Returned array items

| Returned Array items | Type     | Description                                                                                                           |
| -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| value                | Any      | Current value                                                                                                         |
| toggleValue          | function | Toggle function which changes the value to the other value in the list of 2 acceptable values. (Mostly true or false) |
