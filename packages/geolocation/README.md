# @rooks/use-geolocation

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/geolocation/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg) ![](https://img.shields.io/npm/v/@rooks/use-geolocation/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-geolocation.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-geolocation.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fgeolocation)



## About
A hook to provide the geolocation info on client side.

## Installation

```
npm install --save @rooks/use-geolocation
```

## Importing the hook

```javascript
import useGeolocation from "@rooks/use-geolocation";
```

## Usage

### 1. Getting geolocation in a component

```jsx
function App() {
  const geoObj = useGeolocation();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <p>{geoObj && JSON.stringify(geoObj)}</p>
    </div>
  );
}
render(<App />);
```

### 2. Getting geolocation in a component on some condition

```jsx
function App() {
  const [when, setWhen] = React.useState(false);

  const geoObj = useGeolocation({
    when
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <button
        onClick={() => {
          setWhen(true);
        }}
      >
        Get Geolocation
      </button>
      <p>{geoObj && JSON.stringify(geoObj)}</p>
    </div>
  );
}
render(<App />);
```
