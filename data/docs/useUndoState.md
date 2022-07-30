---
id: useUndoState
title: useUndoState
sidebar_label: useUndoState
---

## About

Drop in replacement for useState hook but with undo functionality.

## Examples

### Basic usage

```jsx
import "./styles.css";
import { useUndoState } from "rooks";

const App = () => {
  const [value, setValue, undo] = useUndoState(0);

  return (
    <div>
      <span>Current value: {value}</span>
      <br />
      <button onClick={() => setValue(value + 1)}>Increment</button>
      <button onClick={undo}>Undo</button>
    </div>
  );
};

export default App;
```

### Any kind of value

You can pass any kind of value to hook just like React's own useState.

```jsx
import "./styles.css";
import { useUndoState } from "rooks";

const App = () => {
  const [value, setValue, undo] = useUndoState({ data: 42 });

  return (
    <div>
      <span>Current value: {JSON.stringify(value)}</span>
      <br />
      <button onClick={() => setValue({ data: value.data + 1 })}>
        Increment object data
      </button>
      <button onClick={undo}>Undo</button>
    </div>
  );
};

export default App;
```

### Setter function is still the same

Setter function can also be used with callback just like React's own useState.

```jsx
import "./styles.css";
import { useUndoState } from "rooks";

const App = () => {
  const [value, setValue, undo] = useUndoState(0);

  return (
    <div>
      <span>Current value: {value}</span>
      <br />
      <button onClick={() => setValue(current => current + 1)}>
        Increment
      </button>
      <button onClick={undo}>Undo</button>
    </div>
  );
};

export default App;
```

### Max undo stack size

To preserve memory you can limit number of steps that will be preserved in undo history.

```javascript
import "./styles.css";
import { useUndoState } from "rooks";

const App = () => {
  const [value, setValue, undo] = useUndoState(0, { maxSize: 30 });

  return (
    <div>
      <span>Current value: {value}</span>
      <br />
      <button onClick={() => setValue(current => current + 1)}>
        Increment
      </button>
      <button onClick={undo}>Undo</button>
    </div>
  );
};

export default App;

// now when calling undo only last 30 changes to the value will be preserved
```

## Arguments

| Arguments    | Type    | Description                    | Default value    |
| ------------ | ------- | ------------------------------ | ---------------- |
| initialValue | boolean | Initial value of the state     | false            |
| Options      | Object  | An options object for the hook | \{maxSize: 100\} |

Note: The second argument is an options object which currently accepts a maxSize which governs the maximum number of previous states to keep track of.

### Returned array items

| Returned Array items | Type     | Description                     |
| -------------------- | -------- | ------------------------------- |
| value                | Any      | Current value                   |
| setValue             | function | Setter function to update value |
| undo                 | function | Undo state value                |
