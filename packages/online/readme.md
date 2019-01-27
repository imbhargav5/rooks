# @rooks/use-online

### Online status hook for React.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks)![](https://img.shields.io/npm/v/@rooks/use-online/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-online.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-online.svg)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-online
```

### Importing the hook

```javascript
import useOnline from "@rooks/use-online";
```

### Usage

```jsx
function Demo() {
  const isOnline = useOnline();
  return <p>Online status - {isOnline.toString()}</p>;
}

render(<Demo />);
```

### Return value

Offline status (boolean) is returned.
