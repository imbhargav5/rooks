# @rooks/use-localstorage-state

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/localstorage-state/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-localstorage-state/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-localstorage-state.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-localstorage-state.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Flocalstorage-state)



## About
UseState but auto updates values to localStorage


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-localstorage-state
```

## Importing the hook

```javascript
import useLocalstorageState from "@rooks/use-localstorage-state"
```

## Usage

```jsx
function Demo() {
  useLocalstorageState();
  return null
}

render(<Demo/>)
```
