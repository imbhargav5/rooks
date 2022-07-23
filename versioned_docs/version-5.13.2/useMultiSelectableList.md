---
id: useMultiSelectableList
title: useMultiSelectableList
sidebar_label: useMultiSelectableList
---

## About

A custom hook to easily select multiple values from a list

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useMultiSelectableList } from "rooks";
```

## Usage

```jsx
function Demo() {
  const [selection, { matchSelection, toggleSelection, updateSelections }] =
    useMultiSelectableList(items, [0, 1]);

  return null;
}

render(<Demo />);
```

### Arguments

| Argument value       | Type            | Description                                      | Default value |
| -------------------- | --------------- | ------------------------------------------------ | ------------- |
| list                 | Array           | A list of items of any type                      | `[]`          |
| initialSelectIndices | `Array<number>` | An array of indices that are selected initially  | `[0]`         |
| allowUnselected      | Boolean         | Whether to allow unselect when update selections | `false`       |

### Returns

Returns an array of following items:

| Return value | Type   | Description                                                                            |
| ------------ | ------ | -------------------------------------------------------------------------------------- |
| selection    | Array  | The first item is an array of selected indices, the second item is the selected values |
| methods      | Object | Object with methods to control the selectable list, see the table below                |

Methods:

| Methods          | Type                                                   | Description                                            |
| ---------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| matchSelection   | `({ index?: number, value?: T }) => boolean`           | returns true if the item is selected                   |
| toggleSelection  | `({ index?: number, value?: T }) => () => void`        | returns a function to toggle an item by index or value |
| updateSelections | `({ indices?: number[], values?: T[] }) => () => void` | returns a function to update specified items           |

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/usemultiselectablelist-52ouc?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useMultiSelectableList"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
