# @react-hooks.org/use-counter

### Installation

```
npm install --save @react-hooks.org/use-counter
```

### Usage

```react
function CounterComponent() {
  const {
    value,
    increment,
    decrement,
    incrementBy,
    decrementBy,
    reset
  } = useCounter(3);
  return value;
}

render(<CounterComponent/>)
```

Counter hook for React
