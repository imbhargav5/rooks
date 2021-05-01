# @rooks/use-sessionstorage

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/sessionstorage/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-sessionstorage/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-sessionstorage.svg) ![](https://img.shields.io/npm/dt/@rooks/use-sessionstorage.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fsessionstorage)




## About 
Session storage react hook. Easily manage session storage values.
<br/>

## Installation

```
npm install --save @rooks/use-sessionstorage
```

## Importing the hook

```javascript
import useSessionstorage from "@rooks/use-sessionstorage";
```

## Usage

```jsx
function Demo() {
  const [value, set, remove] = useSessionstorage("my-value", 0);
  // Can also be used as {value, set, remove}

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
