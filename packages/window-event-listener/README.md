# @rooks/use-window-event-listener

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/window-event-listener/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-window-event-listener/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-window-event-listener.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-window-event-listener.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fwindow-event-listener)



## About
Adds an event listener to window


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-window-event-listener
```

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
