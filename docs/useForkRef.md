---
id: useForkRef
title: useForkRef
sidebar_label: useForkRef
---

## About

A hook that can combine two refs(mutable or callbackRefs) into a single callbackRef

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useForkRef } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const [isVisible, setIsVisible] = useState(false);
  const callback = (entries) => {
    if (entries && entries[0]) {
      setIsVisible(entries[0].isIntersecting);
    }
  };
  const [myIntersectionObserverRef] = useIntersectionObserverRef(callback);
  const [
    myBoundingclientrectRef,
    boundingclientrect,
  ] = useBoundingclientrectRef();
  const myRef = useForkRef(myIntersectionObserverRef, myBoundingclientrectRef);
  const displayString = JSON.stringify(boundingclientrect, null, 2);
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
        }}
      >
        <h1>Is rectangle visible - {String(isVisible)}</h1>
      </div>
      <div style={{ height: 2000 }}></div>
      <div ref={myRef} style={{ height: 300, background: 'lightblue' }}>
        <p>Boundingclientrect</p>
        <pre>{displayString}</pre>
      </div>
      <div style={{ height: 2000 }}></div>
    </>
  );
}

render(<Demo />);
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

_Note_: Credit of this hook goes to [material-ui](https://github.com/mui-org/material-ui/)

[Source](https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/utils/useForkRef.js)

## Codesandbox Example

### Basic usage

<iframe src="https://codesandbox.io/embed/useforkref-ptmok?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useForkRef"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
