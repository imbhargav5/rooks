---
id: useOnLongPress
title: useOnLongPress
sidebar_label: useOnLongPress
---

## About

A hook to detect long press on an element.

[//]: # "Main"

## Examples

#### Basic example

```jsx
import { useOnLongPress } from "rooks";
export default function App() {
  const handleLongPress = () => {
    console.log("Long press detected");
  };

  const longPressRef = useOnLongPress(handleLongPress);

  return (
    <>
      <p>
        Press and hold the button for 500ms to trigger a console.log statement
      </p>
      <button ref={longPressRef}>Long press me</button>
    </>
  );
}
```

#### Custom delay and touch end behavior

```jsx
import { useOnLongPress } from "rooks";
export default function App() {
  const handleLongPress = () => {
    console.log("Long press detected");
  };

  const handleTouchEnd = () => {
    console.log("Touch ended before long press completed");
  };

  const longPressRef = useOnLongPress(handleLongPress, {
    delay: 1000,
    onTouchEnd: handleTouchEnd,
  });

  return (
    <>
      <p>
        Press and hold the button for 1000ms to trigger a console.log statement
      </p>
      <button ref={longPressRef}>Long press me</button>
    </>
  );
}
```

### Arguments

| Argument value | Type     | Description                                                | Defualt   |
| -------------- | -------- | ---------------------------------------------------------- | --------- |
| callback       | Function | Callback function to be called when long press is detected | undefined |
| options        | Object   | See table below                                            | undefined |

| Options value | Type     | Description                                                                      | Defualt   |
| ------------- | -------- | -------------------------------------------------------------------------------- | --------- |
| delay         | Number   | The delay (in ms) after which long press is detected                             | 500       |
| onTouchEnd    | Function | Callback function to be called when the touch ends before long press is detected | undefined |

### Returns

| Return value | Type         | Description                                                            | Defualt   |
| ------------ | ------------ | ---------------------------------------------------------------------- | --------- |
| ref          | Callback Ref | A ref that can be used on the element you want to detect long press on | undefined |
