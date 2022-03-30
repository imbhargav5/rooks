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
import { useMapState } from "rooks";
```

## Usage

```jsx
function Demo() {
  const [
    map,
    { set, setMultiple, has, remove, removeMultiple, removeAll },
  ] = useMapState({ a: 1, b: 2 });
  return null;
}

render(<Demo />);
```


### Arguments

| Argument value | Type   | Description              | Defualt   |
|----------------|--------|--------------------------|-----------|
| initialValue   | Object | Initial value of the map | undefined |

### Returns

Returns an array of following items:

| Return value | Type   | Description                                    |
|--------------|--------|------------------------------------------------|
| map          | any    | value of the map                               |
| methods      | Object | methods to modify the map, see the table below |

map methods:

| Return value   | Type                             | Description                           |
|----------------|----------------------------------|---------------------------------------|
| set            | `(key: any, value: any) => void` | set a key value pair in map           |
| has            | `(key: any) => boolean`          | if `key` exists in map                |
| setMultiple    | `(...keys: any[]) => void`       | set multiple key value pair in map    |
| remove         | `(key: any) => void`             | remove a key value pair in map        |
| removeMultiple | `(...keys: any[]) => void`       | remove multiple key value pair in map |
| removeAll      | `() => void`                     | remove all key value pair in map      |



---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/usemapstate-oh8cs?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="usemapstate"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
