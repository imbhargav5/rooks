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
import {useOutsideClickRef} from "rooks"
```

## Usage

```jsx
function Demo() {
  function outsidePClick() {
    alert("Clicked outside p");
  }
  const [ref] = useOutsideClickRef(outsidePClick);
  return (
    <div>
      <p ref={ref}>Click outside me</p>
    </div>
  );
}

render(<Demo/>)
```


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

