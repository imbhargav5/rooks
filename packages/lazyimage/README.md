# @rooks/use-lazyimage

### A custom hook allowing lazy load of images(horizontally or vertically), based on user criteria and respecting the resize of the screen also

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-lazyimage/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-lazyimage.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-lazyimage.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Flazyimage)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-lazyimage
```

### Importing the hook

```javascript
import useLazyImage from "@rooks/use-lazyimage"
```

### Usage

```jsx
function Demo() {
  useLazyImage();
  return null
}

render(<Demo/>)
```
