---
id: use-interval-when
title: use-interval-when
sidebar_label: use-interval-when
---


    

## About

Sets an interval immediately when a condition is true

[//]: # "Main"

## Installation

    npm install --save @rooks/use-interval-when

## Importing the hook

```javascript
import useIntervalWhen from "@rooks/use-interval-when"
```

## Usage

```jsx
function Demo() {
  useIntervalWhen(()=>{
    console.log("runs every 2 seconds")
  }, 2000);
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    