# @rooks/use-boundingclientrect

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/boundingclientrect/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-boundingclientrect/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-boundingclientrect.svg) ![](https://img.shields.io/npm/dt/@rooks/use-boundingclientrect.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fboundingclientrect)


## About
getBoundingClientRect hook for React.
<br/>

## Installation

```
npm install --save @rooks/use-boundingclientrect
```

## Importing the hook

```javascript
import useBoundingclientrect from "@rooks/use-boundingclientrect"
```

## Usage

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

