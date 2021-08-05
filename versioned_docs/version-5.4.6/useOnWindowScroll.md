---
id: useOnWindowScroll
title: useOnWindowScroll
sidebar_label: useOnWindowScroll
---

## About

A React hook for adding an event listener for window scroll
<br/>

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useOnWindowScroll } from 'rooks';
```

## Usage

```jsx
function Demo() {
  useOnWindowScroll(() => console.log('window scrolled'));
  return <p> Hello world </p>;
}

render(<Demo />);
```

### Arguments

| Arguments | Type     | Description                                     | Default value |
| --------- | -------- | ----------------------------------------------- | ------------- |
| callback  | function | Callback function which needs to run on unmount | undefined     |
| when      | boolean  | When the event handler should be active         | true          |

### A React hook for adding an event listener for window scroll

## Codesandbox Example

### Basic Usage

<iframe src="https://codesandbox.io/embed/useonwindowscroll-58uiy?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useOnWindowScroll"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
