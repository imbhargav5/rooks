---
id: useOutsideClick
title: useOutsideClick
sidebar_label: useOutsideClick
---

## About

Outside click event (for a ref) as a React hook.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useOutsideClick } from "rooks";
```

## Usage

### Basic usage

```jsx
import { useOutsideClick } from "rooks";
import { useRef } from "react";

function App() {
  const ref = useRef();
  function myComponent() {
    console.log("Clicked outside");
  }
  useOutsideClick(ref, myComponent);

  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks : useOutsideClick Example</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          backgroundColor: "lightblue"
        }}
        ref={ref}
      >
        <h2 className="inside">
          This is inside
        </h2>
      </div>
    </div>
  );
}
```

### Iframe usage

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

### Arguments

| Arguments | Type                   | Description                                                                                                      | Default value |
|-----------|------------------------|------------------------------------------------------------------------------------------------------------------|---------------|
| ref       | React.MutableRefObject | Ref whose outside click needs to be listened to                                                                  |               |
| handler   | function               | Callback to fire on outside click                                                                                |               |
| when      | boolean                | A boolean which activates the hook only when it is true. Useful for conditionally enable the outside click | true          |

### Returns

No return value.

## Codesandbox Example

### Basic usage

<iframe src="https://codesandbox.io/embed/usenavigatorlanguage-pnk7f?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useNavigatorLanguage"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

### Iframe usage

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
