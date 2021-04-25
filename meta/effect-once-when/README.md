# @rooks/use-effect-once-when

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/effect-once-when/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-effect-once-when/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-effect-once-when.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-effect-once-when.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Feffect-once-when)



## About
Runs a callback effect atmost one time when a condition becomes true


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-effect-once-when
```

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
