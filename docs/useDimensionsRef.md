---
id: useDimensionsRef
title: useDimensionsRef
sidebar_label: useDimensionsRef
---

## About

Easily grab dimensions of an element with a ref using this hook

[//]: # "Main"

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useDimensionsRef } from "rooks";
```

## Usage

```jsx
function Demo() {
  const [ref, dimensions, node] = useDimensionsRef();

  return (
    <div className="App">
      <h1>useDimensionsRef example</h1>
      <div
        ref={ref}
        style={{
          border: "2px solid black",
          width: "200px",
          height: "200px"
        }}
      >
        dimensions.height: {dimensions.height}px
        dimensions.width: {dimensions.width}px
      </div>
    </div>
  );
}

render(<Demo />);
```

### Arguments

| Arguments | Type                                                     | Description                                             | Default value                                      |
|-----------|----------------------------------------------------------|---------------------------------------------------------|----------------------------------------------------|
| options   | `{ updateOnScroll?: boolean, updateOnResize?: boolean }` | Whether to update dimension on window resize and scroll | `{ updateOnScroll = true, updateOnResize = true }` |
=======
| Arguments | Type                                                      | Description                                             | Default value                                        |
|-----------|-----------------------------------------------------------|---------------------------------------------------------|------------------------------------------------------|
| options   | `{ updateOnScroll?: boolean,  updateOnResize?: boolean }` | Whether to update dimension on window resize and scroll | `{  updateOnScroll = true,  updateOnResize = true }` |


### Returns

Returns an array of 3 items:

| Return item | Type                   | Description                                                                          | Default value |
|-------------|------------------------|--------------------------------------------------------------------------------------|---------------|
| ref         | Callback ref           | A callback ref function to be used as a ref for the element that needs to be tracked | undefined     |
| dimensions  | UseDimensionsRefReturn | An object with dimensions of the ref element                                         | null          |
| node        | HTMLElement            | The element being tracked by ref                                                     | null          |

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/usedimensionsref-jjxsy?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useDimensionsRef"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

---

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
