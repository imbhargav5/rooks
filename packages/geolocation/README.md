# @rooks/use-geolocation

### A hook to provide the geolocation info on client side.

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-geolocation/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-geolocation.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-geolocation.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fgeolocation)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-geolocation
```

### Importing the hook

```javascript
import useGeolocation from "@rooks/use-geolocation"
```

### Usage

```jsx
function Demo() {
  useGeolocation();
  return null
}

render(<Demo/>)
```
