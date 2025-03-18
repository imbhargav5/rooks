---
id: useMutationObserverRef
title: useMutationObserverRef
sidebar_label: useMutationObserverRef
---

## About

A hook that tracks mutations of an element. It returns a callbackRef.

## Examples

```jsx
import React, { useState } from "react";
import { useMutationObserverRef } from "rooks";

function Demo() {
  const [mutationCount, setMutationCount] = useState(0);
  const incrementMutationCount = () => {
    return setMutationCount(mutationCount + 1);
  };
  const [myRef] = useMutationObserverRef(incrementMutationCount);
  const [XOffset, setXOffset] = useState(0);
  const [YOffset, setYOffset] = useState(300);
  return (
    <>
      <div
        style={{
          width: "auto",
          background: "lightblue",
          padding: "10px",
          position: "absolute",
          left: XOffset,
          top: YOffset,
        }}
        ref={myRef}
      >
        <div
          style={{
            resize: "both",
            overflow: "auto",
            background: "white",
            color: "blue",
            maxWidth: "100%",
          }}
        >
          <p>
            Resize this div as you see fit. To demonstrate that it also updates
            on child dom nodes resize
          </p>
        </div>
        <h2>Bounds</h2>
        <p>
          <button onClick={() => setXOffset(XOffset - 5)}> Move Left </button>
          <button onClick={() => setXOffset(XOffset + 5)}> Move Right </button>
        </p>
        <p>
          <button onClick={() => setYOffset(YOffset - 5)}> Move Up </button>
          <button onClick={() => setYOffset(YOffset + 5)}> Move Down </button>
        </p>
      </div>
      <div style={{ height: 500 }}>
        <pre>Mutation count {mutationCount}</pre>
      </div>
    </>
  );
}

const App = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks : useMutationObserverRef example</h1>
      <br></br>
      <Demo />
    </div>
  );
};

export default App;
```

### Arguments

| Argument | Type     | Description                                                                                       | Default value                                                             |
| -------- | -------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| callback | function | Function which should be invoked on mutation. It is called with the `mutationList` and `observer` | undefined                                                                 |
| config   | object   | Mutation Observer configuration                                                                   | \{attributes: true,,characterData: true,,subtree: true,,childList: true\} |

### Return value

Returns an array with one element

| Argument | Type        | Description                                |
| -------- | ----------- | ------------------------------------------ |
| ref      | CallbackRef | Ref which should be observed for Mutations |
