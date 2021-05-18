---
id: useTimeout
title: useTimeout
sidebar_label: useTimeout
---

## About

setTimeout hook for react.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useTimeout } from 'rooks';
```

## Usage

```jsx
function TimeoutComponent() {
  function doAlert() {
    window.alert('timeout expired!');
  }
  const { start, clear } = useTimeout(doAlert, 2000);
  return (
    <>
      <button onClick={start}> Start timeout </button>
      <button onClick={clear}> Clear timeout </button>
    </>
  );
}

render(<TimeoutComponent />);
```

### Arguments

| Arguments | Type     | Description                                              | Default value |
| --------- | -------- | -------------------------------------------------------- | ------------- |
| callback  | function | Function to be executed in timeout                       | undefind      |
| delay     | Number   | Number in milliseconds after which callback is to be run | 0             |

### Returned Object keys

| Returned object attributes | Type     | Description           |
| -------------------------- | -------- | --------------------- |
| clear                      | function | Clear the timeout     |
| start                      | function | Start the timeout     |
| isActive                   | boolean  | Is the timeout active |

## Codesandbox Example

### Basic Usage

<iframe src="https://codesandbox.io/embed/usetimeout-i9ppg?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useTimeout"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
