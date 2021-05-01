---
id: use-throttle
title: use-throttle
sidebar_label: use-throttle
---

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

   

## About

Throttle custom hook for React

## Installation

    npm install --save @rooks/use-throttle

## Importing the hook

```javascript
import useThrottle from "@rooks/use-throttle"
```

## Usage

```jss
function ThrottleDemo() {
  const [number, setNumber] = useState(0);
  const addNumber = () => setNumber(number + 1);
  const [addNumberThrottled, isReady] = useThrottle(addNumber, 1000);
  // isReady is a boolean that tells you whether calling addNumberThrottled at that point
  // will fire or not.
  // Once the timeout of 1000ms finishes, isReady will become true to indicate that the next time 
  // addNumberThrottled is called it will run right away.
  return (
    <>
      <h1>Number: {number}</h1>
      <p>Click really fast.</p>
      <button onClick={addNumber}>Add number</button>
      <button onClick={addNumberThrottled}>Add number throttled</button>
    </>
  );
}
```

### Arguments

| Argument            | Type     | Description                         | Default value |
| ------------------- | -------- | ----------------------------------- | ------------- |
| callback (required) | function | Function that needs to be throttle  | undefined     |
| timeout (optional)  | number   | Time to throttle the callback in ms | 300           |


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    