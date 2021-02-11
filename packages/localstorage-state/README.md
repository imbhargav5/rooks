# @rooks/use-localstorage-state
![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/localstorage-state/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-localstorage-state/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-localstorage-state.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-localstorage-state.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Flocalstorage-state)



## About
UseState but auto updates values to localStorage


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-localstorage-state
```

## Importing the hook

```javascript
import useLocalstorageState from "@rooks/use-localstorage-state"
```

## Usage

```jsx
function Demo() {
  useLocalstorageState();
  return null
}

render(<Demo/>)
```
