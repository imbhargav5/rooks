---
id: useOnLongHover
title: useOnLongHover
sidebar_label: useOnLongHover
---

## About

A hook to detect long hover on an element.

[//]: # "Main"

## Examples

#### Basic example

```tsx
import { useOnLongHover } from "rooks";
export default function App() {
  const handleLongHover = () => {
    console.log("Long hover detected");
  };

  const longHoverRef = useOnLongHover(handleLongHover);

  return (
    <>
      <p>Hover on the button for 500ms to trigger a console.log statement</p>
      <button ref={longHoverRef}>Long hover me</button>
    </>
  );
}
```

#### Custom delay and mouse leave behavior

```tsx
import { useOnLongHover } from "rooks";
export default function App() {
  const handleLongHover = () => {
    console.log("Long hover detected");
  };

  const handleMouseLeave = () => {
    console.log("Mouse left before long hover completed");
  };

  const longHoverRef = useOnLongHover(handleLongHover, {
    delay: 1000,
    onMouseLeave: handleMouseLeave,
  });

  return (
    <>
      <p>Hover on the button for 1000ms to trigger a console.log statement</p>
      <button ref={longHoverRef}>Long hover me</button>
    </>
  );
}
```

### Arguments

| Argument value | Type     | Description                                                | Defualt   |
| -------------- | -------- | ---------------------------------------------------------- | --------- |
| callback       | Function | Callback function to be called when long hover is detected | undefined |
| options        | Object   | See table below                                            | undefined |

| Options value | Type     | Description                                                                                    | Defualt   |
| ------------- | -------- | ---------------------------------------------------------------------------------------------- | --------- |
| delay         | Number   | The delay (in ms) after which long hover is detected                                           | 500       |
| onMouseLeave  | Function | Callback function to be called when the mouse leaves the element before long hover is detected | undefined |

### Returns

| Return value | Type         | Description                                                            | Defualt   |
| ------------ | ------------ | ---------------------------------------------------------------------- | --------- |
| ref          | Callback Ref | A ref that can be used on the element you want to detect long hover on | undefined |
