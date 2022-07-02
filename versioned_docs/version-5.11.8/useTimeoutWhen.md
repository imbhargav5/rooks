---
id: useTimeoutWhen
title: useTimeoutWhen
sidebar_label: useTimeoutWhen
---

## About

Takes a callback and fires it when a condition is true

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useTimeoutWhen } from "rooks";
```

## Usage

```jsx
function Demo() {
  const [start, setStart] = useState(false);
  useTimeoutWhen(() => setStart(false), 2000, start);
  return (
    <>
      <h1>Rooks: useTimeoutWhen example</h1>
      <hr></hr>
      <p>Click the button below to disable it for 2 seconds</p>
      <button onClick={() => setStart(true)} disabled={start}>
        Start timeout
      </button>
    </>
  );
}

render(<Demo />);
```

### Arguments

| Arguments | Type     | Description                                              | Default value |
| --------- | -------- | -------------------------------------------------------- | ------------- |
| callback  | function | Function to be executed in timeout                       | undefind      |
| delay     | Number   | Number in milliseconds after which callback is to be run | 0             |
| when      | boolean  | The condition which when true, sets the timeout          | true          |

### Returned

No return value.

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/usetimeoutwhen-l6fbj?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useTimeoutWhen"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
