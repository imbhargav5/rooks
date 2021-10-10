---
id: useLocalstorageState
title: useLocalstorageState
sidebar_label: useLocalstorageState
---

## About

UseState but auto updates values to localStorage

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useLocalstorageState } from "rooks";
```

## Usage

```jsx
function Demo() {
  const [count, setCount] = useLocalstorageState("my-app:count", 0);

  return (
    <div className="App">
      <h1>Rooks : useLocalstorageState</h1>
      <button onClick={() => setCount(0)}>clear</button>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
}

render(<Demo />);
```


### Arguments

| Argument value | Type   | Description                    | Defualt   |
|----------------|--------|--------------------------------|-----------|
| key            | string | Key of the localStorage object | undefined |
| defaultValue   | any    | Default initial value          | null      |

### Returns

Returns an array of following items:

| Return value | Type     | Description                         |
|--------------|----------|-------------------------------------|
| value        | any      | value stored in localStorage        |
| set          | Function | set value stored in localStorage    |
| remove       | Function | remove value stored in localStorage |



---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/uselocalstoragestate-kr16j?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useLocalstorageState"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
