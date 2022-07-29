---
id: useLifecycleLogger
title: useLifecycleLogger
sidebar_label: useLifecycleLogger
---

## About

A react hook that console logs parameters as component transitions through lifecycles.

[//]: # "Main"

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useLifecycleLogger } from "rooks";
```

## Usage

```jsx
function Demo(props) {
  useLifecycleLogger("Demo", props);
  // it will props log on mount, update and unmount
  return null;
}

render(<Demo />);
```

### Arguments

| Argument value | Type   | Description                                              | Defualt     |
| -------------- | ------ | -------------------------------------------------------- | ----------- |
| componentName  | String | The name of component to be shown in the log             | "Component" |
| rest           | Array  | An arry of variables to be logged in component lifecycle | undefined   |

### Returns

No return value

---

## Codesandbox Examples

### Basic Usage

<iframe
  src="https://codesandbox.io/embed/uselifecyclelogger-rgzep?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="useLifecycleLogger example"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

---

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
