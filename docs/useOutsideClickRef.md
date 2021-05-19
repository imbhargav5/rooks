---
id: useOutsideClickRef
title: useOutsideClickRef
sidebar_label: useOutsideClickRef
---

## About

A hook that can track a click event outside a ref. Returns a callbackRef.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useOutsideClickRef } from 'rooks';
```

## Usage

```jsx
function Demo() {
  function outsidePClick() {
    alert('Clicked outside p');
  }
  const [ref] = useOutsideClickRef(outsidePClick);
  return (
    <div>
      <p ref={ref}>Click outside me</p>
    </div>
  );
}

render(<Demo />);
```

## Codesandbox Examples

### Basic usage

<iframe src="https://codesandbox.io/embed/useoutsideclickref-q76i8?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useOutsideClickRef"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
