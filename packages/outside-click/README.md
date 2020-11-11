# @rooks/use-outside-click

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-outside-click/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-outside-click.svg) ![](https://img.shields.io/npm/dt/@rooks/use-outside-click.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Foutside-click)


![Discord Shield](https://discordapp.com/api/guilds/768471216834478131/widget.png?style=banner2)

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
