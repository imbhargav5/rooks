# @rooks/use-isomorphic-effect

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg) ![](https://img.shields.io/npm/v/@rooks/use-isomorphic-effect/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-isomorphic-effect.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-isomorphic-effect.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fisomorphic-effect)


![Discord Shield](https://discordapp.com/api/guilds/768471216834478131/widget.png?style=banner2)

## About 
A hook that resolves to useEffect on the server and useLayoutEffect on the client.

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

