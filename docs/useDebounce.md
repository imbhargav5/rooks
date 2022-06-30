---
id: useDebounce
title: useDebounce
sidebar_label: useDebounce
---

## About

Debounce hook for react. Internally, it uses lodash debounce.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useDebounce } from "rooks";
```

## Usage

```jsx
function App() {
  const [value, setValue] = useState("");
  const setValueDebounced = useDebounce(setValue, 500);

  return (
    <div>
      <input
        onChange={(e) => setValueDebounced(e.target.value)}
        placeholder="Please type here"
      />
      <div>{value}</div>
    </div>
  );
}
```

### Arguments

| Argument | Type     | Description                              | Default value |
| -------- | -------- | ---------------------------------------- | ------------- |
| callback | Function | The function to debounce                 | undefined     |
| wait     | number   | The duration to debounce in milliseconds | undefined     |
| options  | Object   | options to pass into lodash's debounce   | {}            |

### Return Value

| Name              | Type     | Description            |
| ----------------- | -------- | ---------------------- |
| debouncedFunction | Function | The debounced function |

## Codesandbox Examples

### Basic Usage

<iframe
  src="https://codesandbox.io/embed/usedebounce-1fn5t?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="quizzical-glitter-emrtj"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
