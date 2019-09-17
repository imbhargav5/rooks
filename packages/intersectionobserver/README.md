# @rooks/use-intersectionobserver

### A hook which tells you the amount of overlap a DOM element relative to another DOM element

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-intersectionobserver/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-intersectionobserver.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-intersectionobserver.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fintersectionobserver)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-intersectionobserver
```

### Importing the hook

```javascript
import useIntersectionObserver from "@rooks/use-intersectionobserver"
```

### Usage

```jsx
function Demo() {
  useIntersectionObserver();
  return null
}

render(<Demo/>)
```
