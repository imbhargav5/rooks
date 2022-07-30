---
id: useMouse
title: useMouse
sidebar_label: useMouse
---

## About

### Description

Mouse position hook for React.
<br/>

### Return value

useMouse returns a single object containing the mouse position.

| Returned object attributes | Type | Description         |
| -------------------------- | ---- | ------------------- |
| x                          | int  | X position of mouse |
| y                          | int  | Y position of mouse |

<br/>
## Examples
### Basic Usage

```jsx
import { useMouse } from "rooks";

export default function App() {
  const { x, y } = useMouse();
  return (
    <>
      <p> Move mouse here to see changes to position </p>
      <p>X position is {x || "null"}</p>
      <p>X position is {y || "null"}</p>
    </>
  );
}
```

<br/>
