# @rooks/use-fork-ref

### A hook that can combine two refs(mutable or callbackRefs) into a single callbackRef

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-fork-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-fork-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-fork-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ffork-ref)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-fork-ref
```

### Importing the hook

```javascript
import useForkRef from "@rooks/use-fork-ref"
```

### Usage

```jsx
function Demo() {
  useForkRef();
  return null
}

render(<Demo/>)
```
