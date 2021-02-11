---
id: use-event-listener-ref
title: use-event-listener-ref
sidebar_label: use-event-listener-ref
---


    

## About

A react hook to add an event listener to a ref

[//]: # "Main"

## Installation

    npm install --save @rooks/use-event-listener-ref

## Importing the hook

```javascript
import useEventListenerRef from "@rooks/use-event-listener-ref"
```

## Usage

```jsx
function Demo() {
  const ref = useEventListenerRef("click", function(){
    console.log("clicked")
  });
  return <div ref={ref}>
    Click me
  </div>
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage

<iframe
  src="https://codesandbox.io/embed/red-sunset-1ph98?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="red-sunset-1ph98"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    