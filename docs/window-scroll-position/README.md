# @rooks/use-window-scroll-position

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/window-scroll-position/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-window-scroll-position/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-window-scroll-position.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-window-scroll-position.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fwindow-scroll-position)



## About
A React hook to get the scroll position of the window


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-window-scroll-position
```

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
