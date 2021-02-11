# @rooks/use-counter
![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/counter/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-counter/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-counter.svg) ![](https://img.shields.io/npm/dt/@rooks/use-counter.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fcounter)




## About 
Counter hook for React.
<br/>

## Installation

```
npm install --save @rooks/use-counter
```

## Importing the hook

```javascript
import useCounter from "@rooks/use-counter"
```


## Usage

```jsx
function CounterComponent() {
  const {
    value,
    increment,
    decrement,
    incrementBy,
    decrementBy,
    reset
  } = useCounter(3);


  function incrementBy5(){
     incrementBy(5)
  }
  function decrementBy7(){
     decrementBy(7)
  }

  return <>
      Current value is {value}
      <hr/>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
      <button onClick={incrementBy5} >incrementBy5</button>
      <button onClick={decrementBy7} >decrementBy7</button>
      <hr/>
      <button onClick={reset}>reset</button>
  </>;
}

render(<CounterComponent/>)
```

### Arguments

| Argument     | Type   | Description                  |
| ------------ | ------ | ---------------------------- |
| initialValue | number | Initial value of the counter |


### Return

| Return value | Type   | Description                                                                 |
| ------------ | ------ | --------------------------------------------------------------------------- |
| counter      | Object | Object containing {value,increment,decrement,incrementBy,decrementBy,reset} |
