# @rooks/use-outside-click-ref

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/outside-click-ref/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg) ![](https://img.shields.io/npm/v/@rooks/use-outside-click-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-outside-click-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-outside-click-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Foutside-click-ref)




## About 
A hook that can track a click event outside a ref. Returns a callbackRef.

## Installation

```
npm install --save @rooks/use-outside-click-ref
```

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
