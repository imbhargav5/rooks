# @rooks/use-undo-state

### Drop in replacement for useState hook but with undo functionality.

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-undo-state/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-undo-state.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-undo-state.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fundo-state)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-undo-state
```

### Importing the hook

```javascript
import useUndoState from "@rooks/use-undo-state"
```

### Usage

```jsx
function Demo() {
  useUndoState();
  return null
}

render(<Demo/>)
```
