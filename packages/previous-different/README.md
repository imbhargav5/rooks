# @rooks/use-previous-different

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/previous-different/title-card.svg)

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
