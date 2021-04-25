---
id: use-geolocation
title: use-geolocation
sidebar_label: use-geolocation
---

    

## About

A hook to provide the geolocation info on client side.

## Installation

    npm install --save @rooks/use-geolocation

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


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    