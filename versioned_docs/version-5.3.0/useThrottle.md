---
id: useThrottle
title: useThrottle
sidebar_label: useThrottle
---

## About

Throttle custom hook for React

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useThrottle } from 'rooks';
```

## Usage

```jss
function ThrottleDemo() {
  const [number, setNumber] = useState(0);
  const addNumber = () => setNumber(number + 1);
  const [addNumberThrottled, isReady] = useThrottle(addNumber, 1000);
  // isReady is a boolean that tells you whether calling addNumberThrottled at that point
  // will fire or not.
  // Once the timeout of 1000ms finishes, isReady will become true to indicate that the next time
  // addNumberThrottled is called it will run right away.
  return (
    <>
      <h1>Number: {number}</h1>
      <p>Click really fast.</p>
      <button onClick={addNumber}>Add number</button>
      <button onClick={addNumberThrottled}>Add number throttled</button>
    </>
  );
}
```

### Arguments

| Argument            | Type     | Description                         | Default value |
| ------------------- | -------- | ----------------------------------- | ------------- |
| callback (required) | function | Function that needs to be throttle  | undefined     |
| timeout (optional)  | number   | Time to throttle the callback in ms | 300           |

## Codesandbox Example

### Basic usage

<iframe src="https://codesandbox.io/embed/usethrottle-t0qql?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useThrottle"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
