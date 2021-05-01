# @rooks/use-isomorphic-effect


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/isomorphic-effect/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-isomorphic-effect/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-isomorphic-effect.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-isomorphic-effect.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Feffect-once-when)



## About
A hook that resolves to useEffect on the server and useLayoutEffect on the client.


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-isomorphic-effect
```

## Importing the hook

```javascript
import useIsomorphicEffect from "@rooks/use-isomorphic-effect"
```

## Usage

```jsx
function Demo() {
  useIsomorphicEffect( () => {
    console.log("Effect")
  } ,[]);
  return null
}

render(<Demo/>)
```
