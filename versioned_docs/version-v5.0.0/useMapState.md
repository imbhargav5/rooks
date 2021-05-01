---
id: useMapState
title: useMapState
sidebar_label: useMapState
---


    

## About

A react hook to manage state in a key value pair map.

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import {useMapState} from "rooks"
```

## Usage

```jsx
function Demo() {
  const [map, {set, setMultiple, has, remove, removeMultiple, removeAll}] = useMapState({a:1,b:2});
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

