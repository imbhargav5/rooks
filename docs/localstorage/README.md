# @rooks/use-localstorage
![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/localstorage/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-localstorage/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-localstorage.svg) ![](https://img.shields.io/npm/dt/@rooks/use-localstorage.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Flocalstorage)





## About
Localstorage hook for React. Syncs with localstorage values across components and browser windows automatically.

Sets and retrieves a key from localStorage and subscribes to it for updates across windows.

## Installation

```
npm install --save @rooks/use-localstorage
```

## Importing the hook

```javascript
import useLocalstorage from "@rooks/use-localstorage";
```

## Usage

```jsx
function Demo() {
  const [value, set, remove] = useLocalstorage("my-value", 0);
  // Can also be used as {value, set, remove}

  return (
    <p>
      Value is {value}
      <button onClick={() => set(value !== null ? value + 1 : 0)}>
        Increment
      </button>
      <button onClick={remove}>Remove </button>
    </p>
  );
}

render(<Demo />);
```
