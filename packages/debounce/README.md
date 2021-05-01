# @rooks/use-debounce

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/debounce/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-debounce/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-debounce.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-debounce.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fdebounce)




## About 
Debounce hook for react

## Installation

```
npm install --save @rooks/use-debounce
```

## Importing the hook

```javascript
import useDebounce from "@rooks/use-debounce"
```

## Usage

```jsx
function Demo() {
  useDebounce();
  return null
}

render(<Demo/>)
```
