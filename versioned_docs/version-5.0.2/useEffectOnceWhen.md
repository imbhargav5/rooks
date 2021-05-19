---
id: useEffectOnceWhen
title: useEffectOnceWhen
sidebar_label: useEffectOnceWhen
---

## About

Runs a callback effect atmost one time when a condition becomes true

[//]: # 'Main'

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useEffectOnceWhen } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const hasOpenedPage = true;
  useEffectOnceWhen(() => {
    console.log('user has opened page');
  }, hasOpenedPage);
  return null;
}

render(<Demo />);
```

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/useeffectoncewhen-io8wo?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useEffectOnceWhen"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
