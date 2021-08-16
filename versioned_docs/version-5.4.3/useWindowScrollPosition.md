---
id: useWindowScrollPosition
title: useWindowScrollPosition
sidebar_label: useWindowScrollPosition
---

## About

A React hook to get the scroll position of the window

[//]: # 'Main'

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useWindowScrollPosition } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const { scrollX, scrollY } = useWindowScrollPosition();
  return (
    <div>
      <p> Window X position is {scrollX}</p>
      <p> Window Y position is {scrollY}</p>
    </div>
  );
}

render(<Demo />);
```

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/usewindowscrollposition-qspkk?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useWindowScrollPosition"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
