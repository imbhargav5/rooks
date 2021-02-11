---
id: use-outside-click
title: use-outside-click
sidebar_label: use-outside-click
---

   

## About

Outside click(for a ref) event as hook for React.
<br/>

## Installation

    npm install --save @rooks/use-outside-click

## Importing the hook

```javascript
import useOutsideClick from "@rooks/use-outside-click";
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

    