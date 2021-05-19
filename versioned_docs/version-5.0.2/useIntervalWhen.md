---
id: useIntervalWhen
title: useIntervalWhen
sidebar_label: useIntervalWhen
---

## About

Sets an interval immediately when a condition is true

[//]: # 'Main'

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useIntervalWhen } from 'rooks';
```

## Usage

```jsx
function Demo() {
  useIntervalWhen(() => {
    console.log('runs every 2 seconds');
  }, 2000);
  return null;
}

render(<Demo />);
```

---

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

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
