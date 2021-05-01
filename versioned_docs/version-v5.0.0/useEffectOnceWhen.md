---
id: useEffectOnceWhen
title: useEffectOnceWhen
sidebar_label: useEffectOnceWhen
---


    

## About

Runs a callback effect atmost one time when a condition becomes true

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import {useEffectOnceWhen} from "rooks"
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

