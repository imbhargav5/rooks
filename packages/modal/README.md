# @rooks/use-modal

### Exposes modal logic through react context, also provides useToggle hook for controlling modal from other components

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-modal/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-modal.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-modal.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fmodal)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-modal
```

### Importing the hook

```javascript
import useModal from "@rooks/use-modal"
```

### Usage

```jsx
function Demo() {
  useModal();
  return null
}

render(<Demo/>)
```
