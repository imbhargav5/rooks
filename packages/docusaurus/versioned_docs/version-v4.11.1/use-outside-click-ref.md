---
id: use-outside-click-ref
title: use-outside-click-ref
sidebar_label: use-outside-click-ref
---

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

A hook that can track a click event outside a ref. Returns a callbackRef.

## Installation

    npm install --save @rooks/use-outside-click-ref

## Importing the hook

```javascript
import useOutsideClickRef from "@rooks/use-outside-click-ref"
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

    