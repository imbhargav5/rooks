# @rooks/use-boundingclientrect-ref

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/boundingclientrect-ref/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg) ![](https://img.shields.io/npm/v/@rooks/use-boundingclientrect-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-boundingclientrect-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-boundingclientrect-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fboundingclientrect-ref)




## About
A hook that tracks the boundingclientrect of an element. It returns a callbackRef so that the element node if changed is easily tracked. 

## Installation

```
npm install --save @rooks/use-boundingclientrect-ref
```

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

