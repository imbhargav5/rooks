# @rooks/use-resize-observer
![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/resize-observer/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-resize-observer/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-resize-observer.svg) ![](https://img.shields.io/npm/dt/@rooks/use-resize-observer.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fresize-observer)




## About 
Resize Observer hook for React.
<br/>

## Installation

```
npm install --save @rooks/use-resize-observer
```

## Importing the hook

```javascript
import useResizeObserver from "@rooks/use-resize-observer"
```


## Usage

```jsx
function Demo() {
  const myRef = useRef();
  const { height, width } = useResizeObserver(myRef);
  const [XOffset, setXOffset] = useState(0);
  const [YOffset, setYOffset] = useState(300);
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
        <pre>height: {height}</pre>
        <pre>width: {width}</pre>
      </div>
    </>
  );
}

render(<Demo/>)
```

### Arguments

| Argument | Type      | Description                                                                                       | Default value                                                           |
| -------- | --------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| ref      | React ref | Ref which should be observed for Resizes                                                        | undefined                                                               |

