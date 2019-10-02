# @rooks/use-boundingclientrect-ref

### A hook that tracks the boundingclientrect of an element. It returns a callbackRef so that the element node if changed is easily tracked. 

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-boundingclientrect-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-boundingclientrect-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-boundingclientrect-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fboundingclientrect-ref)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-boundingclientrect-ref
```

### Importing the hook

```javascript
import useBoundingclientrectRef from "@rooks/use-boundingclientrect-ref"
```

### Usage

```jsx
function Demo() {
  useBoundingclientrectRef();
  return null
}

render(<Demo/>)
```
