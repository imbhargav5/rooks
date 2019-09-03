# @rooks/use-mutation-observer

### Mutation Observer hook for React.
<br/>


![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-mutation-observer/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-mutation-observer.svg) ![](https://img.shields.io/npm/dt/@rooks/use-mutation-observer.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fmutation-observer)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-mutation-observer
```

### Importing the hook

```javascript
import useMutationObserver from "@rooks/use-mutation-observer"
```


### Usage

```jsx
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
      <div style={{ height: 500 }} onClick={incrementMutationCount}>
        <pre>Mutation count {mutationCount}</pre>
      </div>
    </>
  );
}

render(<Demo/>)
```

### Arguments

| Argument | Type      | Description                                                                                       | Default value                                                           |
| -------- | --------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| ref      | React ref | Ref which should be observed for Mutations                                                        | undefined                                                               |
| callback | function  | Function which should be invoked on mutation. It is called with the `mutationList` and `observer` | undefined                                                               |
| config   | object    | Mutation Observer configuration                                                                   | {attributes: true,,characterData: true,,subtree: true,,childList: true} |

