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



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    