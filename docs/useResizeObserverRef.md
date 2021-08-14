---
id: useResizeObserverRef
title: useResizeObserverRef
sidebar_label: useResizeObserverRef
---

## About 
Resize Observer hook for React.
<br/>

## Installation

```
npm install --save rooks
```

## Importing the hook

```javascript
import { useResizeObserverRef } from "rooks";
```


## Usage

```jsx
function Demo() {
  const myRef = useRef(null);
  const [XOffset, setXOffset] = useState(0);
  const [YOffset, setYOffset] = useState(300);
  const [size, setSize] = useState({ height: 0, width: 0 });
  const callback = () => {
    const height = myRef.current.clientHeight;
    const width = myRef.current.clientWidth;
    if (size.height !== height || size.width !== width)
      setSize(() => ({ height, width })); 
  }
  useResizeObserverRef(myRef, callback);

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
      >
        <div
          style={{
            resize: "both",
            overflow: "auto",
            background: "white",
            color: "blue",
            maxWidth: "100%"
          }}
          ref={myRef}
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
        <pre>height: {size.height}</pre>
        <pre>width: {size.width}</pre>
      </div>
    </>
  );
}

render(<Demo/>)
```

### Arguments

| Argument   | Type                    | Description                                                        | Default value                  |
| ---------- | ----------------------- | ------------------------------------------------------------------ | ------------------------------ |
| ref        | React ref               | Ref which should be observed for Resizes                           | undefined                      |
| callback   | ResizeObserverCallback  | Function that needs to be fired on resize                          | undefined                      |
| options    | Object                  | An options object allowing you to set options for the observation  | {}                             |

## Codesandbox Example

### Basic Usage

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
