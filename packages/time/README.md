# @rooks/use-time

### A react hook to get current time second by second

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-time/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-time.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-time.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ftime)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-time
```

### Importing the hook

```javascript
import useTime from "@rooks/use-time"
```

### Usage

```jsx
function Demo() {
  const time = useTime({
    interval: 1000,
    onTick: console.log,
  });
  return time.toISOString();
}

render(<Demo/>)
```

### Arguments

| Argument            | Type     | Description                         | Default value |
| ------------------- | -------- | ----------------------------------- | ------------- |
| options.interval | number | milliseconds that it takes to return the new time | 1000     |
| options.onTick | function | (time) => {}, callback that would be called every interval | undefined     |


### Return Value

| Type     | Description                         |
| -------- | ----------------------------------- |
| Date | current time | 
