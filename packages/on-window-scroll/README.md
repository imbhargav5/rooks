# @rooks/use-on-window-scroll

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/on-window-scroll/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-on-window-scroll/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-on-window-scroll.svg) ![](https://img.shields.io/npm/dt/@rooks/use-on-window-scroll.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fon-window-scroll)




## About 
A React hook for adding an event listener for window scroll
<br/>

## Installation

```
npm install --save @rooks/use-on-window-scroll
```

## Importing the hook

```javascript
import useOnWindowScroll from "@rooks/use-on-window-scroll"
```


## Usage

```jsx

function Demo() {
  useOnWindowScroll(() => console.log("window scrolled"))
  return <p> Hello world </p>
}

render(<Demo/>)
```

### Arguments

| Arguments | Type     | Description                                     | Default value |
| --------- | -------- | ----------------------------------------------- | ------------- |
| callback  | function | Callback function which needs to run on unmount | undefined     |
| when      | boolean  | When the event handler should be active         | true          |

### A React hook for adding an event listener for window scroll
