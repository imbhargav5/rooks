# @rooks/use-mouse


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/mouse/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-mouse/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-mouse.svg) ![](https://img.shields.io/npm/dt/@rooks/use-mouse.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fmouse)




## About 
Mouse position hook for React.
<br/>


## Installation

```
npm install --save @rooks/use-mouse
```

## Importing the hook

```javascript
import useMouse from "@rooks/use-mouse"
```


## Usage

```jsx
function Demo() {
  const { x, y } = useMouse();
  return (
    <>
      <p> Move mouse here to see changes to position </p>
      <p>X position is {x || "null"}</p>
      <p>X position is {y || "null"}</p>
    </>
  );
}

render(<Demo/>)
```

### Returned Object 

| Returned object attributes | Type | Description         |
| -------------------------- | ---- | ------------------- |
| x                          | int  | X position of mouse |
| y                          | int  | Y position of mouse |
