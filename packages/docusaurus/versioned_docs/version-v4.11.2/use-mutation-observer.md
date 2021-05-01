---
id: use-mutation-observer
title: use-mutation-observer
sidebar_label: use-mutation-observer
---

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

   

## About

Mutation Observer hook for React.
<br/>

## Installation

    npm install --save @rooks/use-mutation-observer

## Importing the hook

```javascript
import useMutationObserver from "@rooks/use-mutation-observer"
```

## Usage

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


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    