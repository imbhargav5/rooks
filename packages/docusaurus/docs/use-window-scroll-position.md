---
id: use-window-scroll-position
title: use-window-scroll-position
sidebar_label: use-window-scroll-position
---


    

## About

A React hook to get the scroll position of the window

[//]: # "Main"

## Installation

    npm install --save @rooks/use-window-scroll-position

## Importing the hook

```javascript
import useWindowScrollPosition from "@rooks/use-window-scroll-position"
```

## Usage

```jsx
function Demo() {
  const {scrollX, scrollY} = useWindowScrollPosition();  
  return <div>
    <p> Window X position is {scrollX}</p>
    <p> Window Y position is {scrollY}</p>
  </div>
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    