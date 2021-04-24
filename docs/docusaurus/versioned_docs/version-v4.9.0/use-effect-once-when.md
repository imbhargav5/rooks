---
id: use-effect-once-when
title: use-effect-once-when
sidebar_label: use-effect-once-when
---


    

## About

Runs a callback effect atmost one time when a condition becomes true

[//]: # "Main"

## Installation

    npm install --save @rooks/use-effect-once-when

## Importing the hook

```javascript
import useEffectOnceWhen from "@rooks/use-effect-once-when"
```

## Usage

```jsx
function Demo() {
  const hasOpenedPage = true
  useEffectOnceWhen(() => {
    console.log("user has opened page")
  },hasOpenedPage);
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    