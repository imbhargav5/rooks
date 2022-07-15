---
id: useAsyncEffect
title: useAsyncEffect
sidebar_label: useAsyncEffect
---


## About
This is a version of useEffect that accepts an async function.

`useEffect` only works with effect functions that run synchronously. The go-to solution for most people is to simply run an async function inside `useEffect`, but that approach has a lot of gotchas involving React state manipulation.


## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useAsyncEffect } from "rooks"
```

## Usage

### Basic usage

```jsx
function SimpleDemo() {
  useAsyncEffect(async (signal) => {
    console.log("I'm an async function!")
  }, []);

  return null
}

render(<SimpleDemo />)
```

### Usage with React state

If you are going to modify React state inside `useAsyncEffect`, you have to check for cancellation signals. Otherwise, your components might start behaving unexpectedly.

```jsx
function StatefulDemo() {
  const [counter, setCounter] = useState(0)

  useAsyncEffect(async (signal) => {
    await longOperation()

    // This is the line you should include before changing state
    if (signal.aborted) return

    setCounter((oldCounter) => oldCounter + 1)
  }, []);

  return (
    <div>
      The count is: {counter}
    </div>
  )
}

render(<StatefulDemo />)
```

### Cleanup functions

`useAsyncEffect` supports cleanup functions. For information about cleanup functions, see the [React docs](https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup).

```jsx
function CleanupDemo() {
  useAsyncEffect(async (signal) => {
    const interval = setInterval(doSomething, 200)

    return () => {
      clearInterval(interval)
    }
  }, []);

  return null
}

render(<CleanupDemo />)
```

---
## Join Bhargav's Discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
