---
id: useIsomorphicEffect
title: useIsomorphicEffect
sidebar_label: useIsomorphicEffect
---

## About

A hook that resolves to useEffect on the server and useLayoutEffect on the client.

[//]: # 'Main'

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useIsomorphicEffect } from 'rooks';
```

## Usage

```jsx
function Demo() {
  useIsomorphicEffect(() => {
    console.log('Effect');
  }, []);
  return null;
}

render(<Demo />);
```

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/useisomorphiceffect-kn02d?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useIsomorphicEffect"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
