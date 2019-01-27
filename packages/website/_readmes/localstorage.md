# @rooks/use-localstorage

### Localstorage hook for React. Syncs with localstorage values across components and browser windows automatically.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-localstorage/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-localstorage.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-localstorage.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Flocalstorage)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

Sets and retrieves a key from localStorage and subscribes to it for updates across windows.

### Installation

```
npm install --save @rooks/use-localstorage
```

### Importing the hook

```javascript
import useLocalstorage from "@rooks/use-localstorage";
```

### Usage

```jsx
function Demo() {
  const { value, set, remove } = useLocalstorage("my-value", 0);
  return (
    <p>
      Value is {value}{" "}
      <button onClick={() => set(value !== null ? parseFloat(value) + 1 : 0)}>
        Increment
      </button>
      <button onClick={remove}>Remove </button>
    </p>
  );
}

render(<Demo />);
```
