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

```jsx
function Demo() {
  const [text, setText] = useState("");
  const [throttleValue, setThrottleValue] = useState("");
  const [throttledFn, isReady] = useThrottle(changeThrottleValue, 1000);
  // isReady is a boolean that tells you whether calling throttledFn at that point
  // will fire or not.
  // Once the timeout of 1000ms finishes, isReady will become true to indicate that the next time
  // throttledFn is called it will run right away.
  const ref = useRef(null);

  function changeThrottleValue() {
    setThrottleValue(ref.current.value);
  }

  return (
    <div>
      <h1>Rooks : useThrottle example</h1>
      <input
        ref={ref}
        onChange={(e) => {
          setText(e.target.value);
          if (isReady) throttledFn();
        }}
      />
      <p>Actual value: {text}</p>
      <p>
        Throttled value (being updated at most once per second): {throttleValue}
      </p>
    </div>
  );
}

render(<Demo />);
```

### Arguments

| Argument            | Type     | Description                         | Default value |
| ------------------- | -------- | ----------------------------------- | ------------- |
| callback (required) | Function | Function that needs to be throttled | undefined     |
| timeout (optional)  | Number   | Time to throttle the callback in ms | 300           |

### Return value

| Return value         | Type         | Description                                                                        |
| -------------------- | ------------ | ---------------------------------------------------------------------------------- |
| throttledFunction    | Function     | A throttled function that will run at most once per timeout ms                     |
| isReady              | Boolean      | Tells whether calling throttledFunction at that point will fire or not             |

## Codesandbox Example

### Basic usage

<iframe 
  src="https://codesandbox.io/embed/usethrottle-forked-0nf94?fontsize=14&hidenavigation=1&theme=dark"
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
