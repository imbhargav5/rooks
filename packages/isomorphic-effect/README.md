# @rooks/use-isomorphic-effect

### A hook that resolves to useEffect on the server and useLayoutEffect on the client.

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-isomorphic-effect/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-isomorphic-effect.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-isomorphic-effect.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fisomorphic-effect)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-isomorphic-effect
```

### Importing the hook

```javascript
import useIsomorphicEffect from "@rooks/use-isomorphic-effect"
```

### Usage

```jsx
function Demo() {
  useIsomorphicEffect();
  return null
}

render(<Demo/>)
```
