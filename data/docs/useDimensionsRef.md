---
id: useDimensionsRef
title: useDimensionsRef
sidebar_label: useDimensionsRef
---

## About

Easily grab dimensions of an element with a ref using this hook

[//]: # "Main"

## Examples

```jsx
import { useDimensionsRef } from "rooks";

export default function App() {
  const [ref, dimensions, node] = useDimensionsRef();

  return (
    <div className="App">
      <h1>useDimensionsRef example</h1>
      <div
        ref={ref}
        style={{
          border: "2px solid black",
          width: "200px",
          height: "200px",
        }}
      >
        dimensions.height: {dimensions?.height}px
        <br />
        dimensions.width: {dimensions?.width}px
      </div>
    </div>
  );
}
```

### Arguments

| Arguments | Type                                                     | Description                                             | Default value                                      |
| --------- | -------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| options   | \{ updateOnScroll?: boolean, updateOnResize?: boolean \} | Whether to update dimension on window resize and scroll | \{ updateOnScroll = true, updateOnResize = true \} |

### Returns

Returns an array of 3 items:

| Return item | Type                   | Description                                                                          | Default value |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------ | ------------- |
| ref         | Callback ref           | A callback ref function to be used as a ref for the element that needs to be tracked | undefined     |
| dimensions  | UseDimensionsRefReturn | An object with dimensions of the ref element                                         | null          |
| node        | HTMLElement            | The element being tracked by ref                                                     | null          |

---
