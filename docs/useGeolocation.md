---
id: useGeolocation
title: useGeolocation
sidebar_label: useGeolocation
---

## About

A hook to provide the geolocation info on client side.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useGeolocation } from 'rooks';
```

## Usage

### 1. Getting geolocation in a component

```jsx
function App() {
  const geoObj = useGeolocation();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
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
    when,
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
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

## Codesandbox Example

### Basic Usage

<iframe src="https://codesandbox.io/embed/usegeolocation-r1lm7?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useGeolocation"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
