# @rooks/use-interval

### setInterval hook for React.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-interval/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-interval.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-interval.svg)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-interval
```

### Importing the hook

```javascript
import useInterval from "@rooks/use-interval"
```


### Usage

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      return state;
  }
}

function Demo() {
  const [value, dispatcher] = useReducer(reducer, { count: 0 });

  function increment() {
    dispatcher({
      type: "increment"
    });
  }

  const { start, stop } = useInterval(() => {
    increment();
  }, 1000);

  return (
    <>
      <p>value is {value.count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
render(<Demo/>)
```

### Arguments

| Argument         | Type     | Description                                              | Default value |
| ---------------- | -------- | -------------------------------------------------------- | ------------- |
| callback         | function | Function be invoked after each interval duration         | undefined     |
| intervalDuration | number   | Duration in milliseconds after which callback is invoked | undefined     |
| startImmediate   | boolean  | Should the timer start immediately or no                 | false         |

### Returned Object

| Returned object attributes | Type       | Description                |
| -------------------------- | ---------- | -------------------------- |
| start                      | function   | Start the interval         |
| stop                       | function   | Stop the interval          |
| intervalId                 | intervalId | IntervalId of the interval |
