---
id: use-did-mount
title: use-did-mount
sidebar_label: use-did-mount
---


   

## About

componentDidMount hook for React
<br/>

## Installation

    npm install --save @rooks/use-did-mount

## Importing the hook

```javascript
import useDidMount from "@rooks/use-did-mount"
```

## Usage

```jsx
function Demo() {
  useDidMount(function(){
    console.log("mounted")
  });
  return null
}

render(<Demo/>)
```

### Arguments

| Argument | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| callback | function | function to be called on mount |


---

## Codesandbox Examples

### Basic Usage

<iframe
  src="https://codesandbox.io/embed/quizzical-glitter-emrtj?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="quizzical-glitter-emrtj"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    