---
id: useOutsideClick
title: useOutsideClick
sidebar_label: useOutsideClick
---

   

## About

Outside click(for a ref) event as hook for React.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import {useOutsideClick} from "rooks";
```

## Usage

```jsx
function Demo() {
  const pRef = useRef();
  function outsidePClick() {
    alert("Clicked outside p");
  }
  useOutsideClick(pRef, outsidePClick);
  return (
    <div>
      <p ref={pRef}>Click outside me</p>
    </div>
  );
}

render(<Demo />);
```


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

