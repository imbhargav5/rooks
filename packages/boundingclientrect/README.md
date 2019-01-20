# @rooks/use-boundingclientrect

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) 

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"></a>

### Installation

```
npm install --save @rooks/use-boundingclientrect
```

### Usage

```jsx
function Demo() {
  const myRef = useRef();
  const getBoundingClientRect = useBoundingclientrect(myRef);
  const [XOffset, setXOffset] = useState(0);
  const [YOffset, setYOffset] = useState(300);
  const displayString = JSON.stringify(getBoundingClientRect, null, 2);
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

| Argument | Type      | Description                                       |
| -------- | --------- | ------------------------------------------------- |
| ref      | React ref | React ref whose boundingClientRect is to be found |

### Return

| Return value | Type    | Description                                                                  | Default value |
| ------------ | ------- | ---------------------------------------------------------------------------- | ------------- |
| value        | DOMRect | DOMRect Object containing x,y, width, height, left,right,top and bottom keys | null          |

Bounding client rect hook for React.
