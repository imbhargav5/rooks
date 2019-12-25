# @rooks/use-fullscreen

### Use full screen api for making beautiful and emersive experinces.

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-fullscreen/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-fullscreen.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-fullscreen.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ffullscreen)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-fullscreen
```

### Importing the hook

```javascript
import useFullscreen from "@rooks/use-fullscreen"
```

### Usage

```jsx
function Demo() {
  const {isEnabled, toggle} = useFullscreen();
  return (    
    <img
      src=""
      onClick={(e) => {
        if(isEnabled) {          
          toggle(e.target)}
        }
      } 
    />
  )
}

render(<Demo/>)
```
