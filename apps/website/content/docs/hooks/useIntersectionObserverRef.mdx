---
id: useIntersectionObserverRef
title: useIntersectionObserverRef
sidebar_label: useIntersectionObserverRef
---

## About

A hook to register an intersection observer listener.

## Examples

### Basic usage

```jsx
import React, { useState } from "react";
import { useIntersectionObserverRef } from "rooks";
import "./styles.css";

function App() {
  const [isThingIntersecting, setThingIntersecting] = useState(false);
  const callback = entries => {
    if (entries && entries[0]) {
      setThingIntersecting(entries[0].isIntersecting);
    }
  };
  const [myRef] = useIntersectionObserverRef(callback);

  return (
    <div className="App">
      <h1>Rooks : useIntersectionObserverRef example</h1>
      <h3>Scroll down</h3>
      <div
        style={{
          position: "fixed",
          left: "250px",
        }}
      >
        <h1>Is rectangle visible - {String(isThingIntersecting)}</h1>
      </div>
      <div style={{ height: 1500 }}></div>
      <div ref={myRef} style={{ height: 300, background: "teal" }}></div>
    </div>
  );
}

export default App;
```

### Arguments

| Argument | Type                         | Description                                                                                                                  | Default Value                                                    |
| -------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| callback | IntersectionObserverCallback | Callback that will be fired when the intersection occurs                                                                     | undefined                                                        |
| options  | IntersectionObserverInit     | Intersection Observer config ([read more](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver#properties)) | `{ root: null,rootMargin: "0px 0px 0px 0px", threshold: [0, 1]}` |

### Return

Returns an array with the first element in the array being the callback ref for the React component/element that needs to be observed.

| Return value | Type        | Description                                                    | Default value |
| ------------ | ----------- | -------------------------------------------------------------- | ------------- |
| ref          | CallbackRef | ref for the React component/element that needs to be observed. | null          |
