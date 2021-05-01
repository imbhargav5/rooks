---
id: use-counter
title: use-counter
sidebar_label: use-counter
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

   

## About

Counter hook for React.
<br/>

## Installation

    npm install --save @rooks/use-counter

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


---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/use-counter-p5rks?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark"
     style={{
        width: "100%",
        height: 500,
        border: 0,
        borderRadius: 4,
        overflow: "hidden"
    }}
     title="use-counter"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    