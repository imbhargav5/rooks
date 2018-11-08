# @react-hooks.org/use-counter

### Installation

```bash
npm install --save @react-hooks.org/use-counter
```

### Usage

```jsx
function CounterComponent() {
  //...
  const {
    value,
    increment,
    decrement,
    incrementBy,
    decrementBy,
    reset
  } = useCounter(3);
}
```
