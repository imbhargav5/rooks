# @rooks/use-map-state

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/map-state/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-map-state/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-map-state.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-map-state.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fmap-state)



## About
A react hook to manage state in a key value pair map.


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-map-state
```

## Importing the hook

```javascript
import useMapState from "@rooks/use-map-state"
```

## Usage

```jsx
function Demo() {
  const [map, {set, setMultiple, has, remove, removeMultiple, removeAll}] = useMapState({a:1,b:2});
  return null
}

render(<Demo/>)
```
