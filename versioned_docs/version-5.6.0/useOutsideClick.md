---
id: useOutsideClick
title: useOutsideClick
sidebar_label: useOutsideClick
---

## About

Outside click(for a ref) event as hook for React.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useOutsideClick } from "rooks";
```

## Usage

```jsx
function Demo() {
  const pRef = useRef();
  function outsidePClick() {
    console.log("click outside");
  }
  useOutsideClick(pRef, outsidePClick, true);

  return (
    <div>
      <p style={{ background: "red", color: "white" }} ref={pRef}>
        Click outside me, or click on an iframe, and check the log in the
        console
      </p>
      <hr />
      <h1>I'm an iframe</h1>
      <iframe title="example" src="https://example.com/" />
    </div>
  );
}

render(<Demo />);
```

### Codesandbox Example

## Basic usage

<iframe src="https://codesandbox.io/embed/useoutsideclick-ctkk6?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.tsx&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useOutsideClickRef"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
