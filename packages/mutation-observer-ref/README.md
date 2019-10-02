# @rooks/use-mutation-observer-ref

### A hook that tracks mutations of an element. It returns a callbackRef.

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-mutation-observer-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-mutation-observer-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-mutation-observer-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fmutation-observer-ref)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-mutation-observer-ref
```

### Importing the hook

```javascript
import useMutationObserverRef from "@rooks/use-mutation-observer-ref"
```

### Usage

```jsx
function Demo() {
  useMutationObserverRef();
  return null
}

render(<Demo/>)
```
