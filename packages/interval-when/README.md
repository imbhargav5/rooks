# @rooks/use-interval-when


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/interval-when/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-interval-when/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-interval-when.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-interval-when.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Finterval-when)



## About
Sets an interval immediately when a condition is true


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-interval-when
```

## Importing the hook

```javascript
import useIntervalWhen from "@rooks/use-interval-when"
```

## Usage

```jsx
function Demo() {
  useIntervalWhen(()=>{
    console.log("runs every 2 seconds")
  }, 2000);
  return null
}

render(<Demo/>)
```
