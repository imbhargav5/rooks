# @rooks/use-sessionstorage-state

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/sessionstorage-state/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-sessionstorage-state/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-sessionstorage-state.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-sessionstorage-state.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fsessionstorage-state)



## About
useState but syncs with sessionstorage


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-sessionstorage-state
```

## Importing the hook

```javascript
import useSessionstorageState from "@rooks/use-sessionstorage-state"
```

## Usage

```jsx
function Demo() {
  useSessionstorageState();
  return null
}

render(<Demo/>)
```
