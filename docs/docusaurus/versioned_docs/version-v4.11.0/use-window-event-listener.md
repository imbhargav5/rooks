---
id: use-window-event-listener
title: use-window-event-listener
sidebar_label: use-window-event-listener
---


    

## About

Adds an event listener to window

[//]: # "Main"

## Installation

    npm install --save @rooks/use-window-event-listener

## Importing the hook

```javascript
import useWindowEventListener from "@rooks/use-window-event-listener"
```

## Usage

```jsx
function Demo() {
  useWindowEventListener("click", function(){
    console.log("clicked")
  });
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage

<iframe
  src="https://codesandbox.io/embed/beautiful-dan-y74hx?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="beautiful-dan-y74hx"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    