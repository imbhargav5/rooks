# @rooks/use-interval


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/interval/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-interval/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-interval.svg) ![](https://img.shields.io/npm/dt/@rooks/use-interval.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Finterval)




## About 
setInterval hook for React.
<br/>

## Installation

```
npm install --save @rooks/use-interval
```

## Importing the hook

```javascript
import useInterval from "@rooks/use-interval"
```


## Usage

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
