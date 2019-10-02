# @rooks/use-intersection-observer-ref

### A hook to register an intersection observer listener

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-intersection-observer-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-intersection-observer-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-intersection-observer-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fintersection-observer-ref)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-intersection-observer-ref
```

### Importing the hook

```javascript
import useIntersectionObserverRef from "@rooks/use-intersection-observer-ref"
```

### Usage

```jsx
function Demo() {
  useIntersectionObserverRef();
  return null
}

render(<Demo/>)
```
