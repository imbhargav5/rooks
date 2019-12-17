---
id: version-3.5.0-use-geolocation
title: use-geolocation
sidebar_label: use-geolocation
original_id: use-geolocation
---

# @rooks/use-geolocation

### A hook to provide the geolocation info on client side.

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-geolocation/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-geolocation.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-geolocation.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fgeolocation)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-geolocation
```

### Importing the hook

```javascript
import useGeolocation from "@rooks/use-geolocation";
```

### Usage

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

### 1. Getting geolocation in a component on some condition

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

    