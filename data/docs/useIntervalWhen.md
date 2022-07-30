---
id: useIntervalWhen
title: useIntervalWhen
sidebar_label: useIntervalWhen
---

## About

Sets an interval immediately when a condition is true

[//]: # "Main"

## Examples

```jsx
function App() {
  const [value, setValue] = useState(0);
  const [booleanState, setBooleanState] = useState(true);

  useIntervalWhen(
    () => {
      setValue(value + 10);
    },
    1000, // run callback every 1 second
    booleanState, // start the timer when it's true
    true // no need to wait for the first interval
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks: useIntervalWhen example</h1>
      <h2>Value: {value}</h2>
    </div>
  );
}
```

### Arguments

| Argument         | Type     | Description                                              | Default value |
| ---------------- | -------- | -------------------------------------------------------- | ------------- |
| callback         | function | Function be invoked after each interval duration         | undefined     |
| intervalDuration | number   | Duration in milliseconds after which callback is invoked | 0             |
| when             | boolean  | Only start timer when `when` is true                     | true          |
| startImmediate   | boolean  | Should the timer start immediately or no                 | false         |

### Returned Object

No return value.

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/useintervalwhen-lej6t?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useIntervalWhen"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
