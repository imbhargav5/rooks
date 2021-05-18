---
id: useBoundingclientrectRef
title: useBoundingclientrectRef
sidebar_label: useBoundingclientrectRef
---

## About

A hook that tracks the boundingclientrect of an element. It returns a callbackRef so that the element node if changed is easily tracked.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useBoundingclientrectRef } from 'rooks';
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
          background: 'lightblue',
          padding: '10px',
          position: 'absolute',
          left: XOffset,
          top: YOffset,
        }}
        ref={myRef}
      >
        <div
          style={{
            resize: 'both',
            overflow: 'auto',
            background: 'white',
            color: 'blue',
            maxWidth: '100%',
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

render(<Demo />);
```

### Arguments

N/A

### Returns an array of 3 values

| Return value | Type         | Description                                                                        | Default value |
| ------------ | ------------ | ---------------------------------------------------------------------------------- | ------------- |
| ref          | Callback ref | A callback ref function to use as a ref for the component that needs to be tracked | () => null    |
| value        | DOMRect      | DOMRect Object containing x,y, width, height, left,right,top and bottom keys       | null          |
| update       | Function     | Function that can be called at any time to force a recalculation of the clientrect | null          |

## Codesandbox Example

### Basic Usage

<iframe src="https://codesandbox.io/embed/useboundingclientrectref-kqc8y?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useBoundingclientrectRef"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
