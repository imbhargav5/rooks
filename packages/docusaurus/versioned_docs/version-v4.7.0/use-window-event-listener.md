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



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    