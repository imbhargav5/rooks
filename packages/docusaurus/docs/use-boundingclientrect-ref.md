---
id: use-boundingclientrect-ref
title: use-boundingclientrect-ref
sidebar_label: use-boundingclientrect-ref
---

    

## About

A hook that tracks the boundingclientrect of an element. It returns a callbackRef so that the element node if changed is easily tracked.

## Installation

    npm install --save @rooks/use-boundingclientrect-ref

## Importing the hook

```javascript
import useBoundingclientrectRef from "@rooks/use-boundingclientrect-ref"
```

## Usage

```jsx
function Demo() {
  const [myRef, boundingClientRect] = useBoundingclientrectRef();
  const [XOffset, setXOffset] = useState(0);
  const [YOffset, setYOffset] = useState(300);
  const displayString = JSON.stringify(boundingClientRect, null, 2);
  return (
    <>
      <div
        style={{
          width: 300,
          background: "lightblue",
          padding: "10px",
          position: "absolute",
          left: XOffset,
          top: YOffset
        }}
        ref={myRef}
      >
        <div
          style={{
            resize: "both",
            overflow: "auto",
            background: "white",
            color: "blue",
            maxWidth: "100%"
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
        <pre>{displayString}</pre>
      </div>
    </>
  );
}

render(<Demo/>)
```

### Arguments

N/A

### Returns an array of 3 values

| Return value | Type         | Description                                                                        | Default value |
| ------------ | ------------ | ---------------------------------------------------------------------------------- | ------------- |
| ref          | Callback ref | A callback ref function to use as a ref for the component that needs to be tracked | () => null    |
| value        | DOMRect      | DOMRect Object containing x,y, width, height, left,right,top and bottom keys       | null          |
| update       | Function     | Function that can be called at any time to force a recalculation of the clientrect | null          |


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    