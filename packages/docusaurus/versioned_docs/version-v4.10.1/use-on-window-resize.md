---
id: use-on-window-resize
title: use-on-window-resize
sidebar_label: use-on-window-resize
---

   

## About

A React hook for adding an event listener for window resize
<br/>

## Installation

    npm install --save @rooks/use-on-window-resize

## Importing the hook

```javascript
import useOnWindowResize from "@rooks/use-on-window-resize"
```

## Usage

```jsx

function Demo() {
  useOnWindowResize(() => console.log("window resized"))
  return <p> Hello world </p>
}

render(<Demo/>)
```

### Arguments

| Arguments | Type     | Description                                     | Default value |
| --------- | -------- | ----------------------------------------------- | ------------- |
| callback  | function | Callback function which needs to run on unmount | undefined     |
| when      | boolean  | When the event handler should be active         | true          |

### A React hook for adding an event listener for window resize


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    