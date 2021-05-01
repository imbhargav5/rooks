# @rooks/use-outside-click

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/outside-click/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-outside-click/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-outside-click.svg) ![](https://img.shields.io/npm/dt/@rooks/use-outside-click.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Foutside-click)




## About 
Outside click(for a ref) event as hook for React.
<br/>

## Installation

```
npm install --save @rooks/use-outside-click
```

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
