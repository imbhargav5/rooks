---
id: useMediaMatch
title: useMediaMatch
sidebar_label: useMediaMatch
---

## About

Signal whether or not a media query is currently matched.

[//]: # 'Main'

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useMediaMatch } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const isNarrowWidth = useMediaMatch('(max-width: 600px)');
  return <span>Your screen is {isNarrowWidth ? 'narrow' : 'wide'}.</span>;
}

render(<Demo />);
```

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/usemediamatch-f616x?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useMediaMatch"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
