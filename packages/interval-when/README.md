# @rooks/use-interval-when

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/interval-when/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-interval-when/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-interval-when.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-interval-when.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Finterval-when)



## About
Sets an interval immediately when a condition is true


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-interval-when
```

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
