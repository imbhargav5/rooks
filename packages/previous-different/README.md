# @rooks/use-previous-different


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/previous-different/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-previous-different/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-previous-different.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-previous-different.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fprevious-different)



## About
usePreviousDifferent returns the last different value of a variable


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-previous-different
```

## Importing the hook

```javascript
import usePreviousDifferent from "@rooks/use-previous-different"
```

## Usage

```jsx
function Demo() {
  const [value, setValue] = useState(0)
  const previousValue = usePreviousDifferent(value) 
  return null
}

render(<Demo/>)
```
