# @rooks/use-fork-ref

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/fork-ref/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg) ![](https://img.shields.io/npm/v/@rooks/use-fork-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-fork-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-fork-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ffork-ref)





## About
A hook that can combine two refs(mutable or callbackRefs) into a single callbackRef

## Installation

```
npm install --save @rooks/use-fork-ref
```

## Importing the hook

```javascript
import useForkRef from "@rooks/use-fork-ref"
```

## Usage

```jsx
function Demo() {
  const [isVisible, setIsVisible] = useState(false);
  const callback = entries => {
    if (entries && entries[0]) {
      setIsVisible(entries[0].isIntersecting);
    }
  };
  const [myIntersectionObserverRef] = useIntersectionObserverRef(callback);
  const [
    myBoundingclientrectRef,
    boundingclientrect
  ] = useBoundingclientrectRef();
  const myRef = useForkRef(myIntersectionObserverRef, myBoundingclientrectRef);
  const displayString = JSON.stringify(boundingclientrect, null, 2);
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0
        }}
      >
        <h1>Is rectangle visible - {String(isVisible)}</h1>
      </div>
      <div style={{ height: 2000 }}></div>
      <div ref={myRef} style={{ height: 300, background: "lightblue" }}>
        <p>Boundingclientrect</p>
        <pre>{displayString}</pre>
      </div>
      <div style={{ height: 2000 }}></div>
    </>
  );
}

render(<Demo/>)
```


### Arguments

| Argument value | Type                 | Description |
| -------------- | -------------------- | ----------- |
| ref2           | Callback/Mutable ref | First ref   |
| ref1           | Callback/Mutable ref | Second ref  |

### Returns

| Return value | Type         | Description                                                                           | Default value |
| ------------ | ------------ | ------------------------------------------------------------------------------------- | ------------- |
| ref          | Callback ref | A callback ref function that can internally combines both the refs from the arguments | () => null    |

## Original source

*Note*: Credit of this hook goes to [material-ui](https://github.com/mui-org/material-ui/)

[Source](https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/utils/useForkRef.js)