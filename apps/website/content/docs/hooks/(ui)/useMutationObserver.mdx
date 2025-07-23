---
id: useMutationObserver
title: useMutationObserver
sidebar_label: useMutationObserver
---

## About

Mutation Observer hook for React.

## Examples

```jsx
import React, { useState, useRef } from "react";
import { useMutationObserver } from "rooks";

function Demo() {
  const myRef = useRef();
  const [mutationCount, setMutationCount] = useState(0);
  const incrementMutationCount = () => {
    return setMutationCount(mutationCount + 1);
  };
  useMutationObserver(myRef, incrementMutationCount);
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
      <div style={{ height: 500 }} onClick={incrementMutationCount}>
        <pre>Mutation count {mutationCount}</pre>
      </div>
    </>
  );
}

const App = () => {
  // useMutationObserver =>
  // which runs a callback whenever a target element changes, passed in as a react ref.

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks : useMutationObserver example</h1>
      <br></br>
      <Demo />
    </div>
  );
};

export default App;
```

### Arguments

| Argument | Type      | Description                                                                                       | Default value                                                             |
| -------- | --------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ref      | React ref | Ref which should be observed for Mutations                                                        | undefined                                                                 |
| callback | function  | Function which should be invoked on mutation. It is called with the `mutationList` and `observer` | undefined                                                                 |
| config   | object    | Mutation Observer configuration                                                                   | \{attributes: true,,characterData: true,,subtree: true,,childList: true\} |
