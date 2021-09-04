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

### Arguments

| Arguments | Type                   | Description                                                                                                      | Default value |
|-----------|------------------------|------------------------------------------------------------------------------------------------------------------|---------------|
| ref       | React.MutableRefObject | Ref whose outside click needs to be listened to                                                                  |               |
| handler   | function               | Callback to fire on outside click                                                                                |               |
| when      | boolean                | A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click | true          |

### Returns

No return value.

## Codesandbox Example

### Basic usage

<iframe src="https://codesandbox.io/embed/useoutsideclick-g590d?fontsize=14&hidenavigation=1&theme=dark"
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
/ >

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
