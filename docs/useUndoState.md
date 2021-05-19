---
id: useUndoState
title: useUndoState
sidebar_label: useUndoState
---

## About

Drop in replacement for useState hook but with undo functionality.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useUndoState } from 'rooks';
```

## Usage

```jsx
const Demo = () => {
  const [value, setValue, undo] = useUndoState(0);

  return (
    <div>
      <span>Current value: {value}</span>
      <button onClick={() => setValue(value + 1)}>Increment</button>
      <button onClick={undo}>Undo</button>
    </div>
  );
};

render(<Demo />);
```

You can pass any kind of value to hook just like React's own useState.

```jsx
const Demo = () => {
  const [value, setValue, undo] = useUndoState({ data: 42 });

  return (
    <div>
      <span>Current value: {value}</span>
      <button onClick={() => setValue({ data: value.data + 1 })}>
        Increment object data
      </button>
      <button onClick={undo}>Undo</button>
    </div>
  );
};

render(<Demo />);
```

Setter function can also be used with callback just like React's own useState.

```javascript
const [value, setValue, undo] = useUndoState({ data: 42 })

() => setValue(current => current + 1)
```

```jsx
const Demo = () => {
  const [value, setValue, undo] = useUndoState(0);

  return (
    <div>
      <span>Current value: {value}</span>
      <button onClick={() => setValue((current) => current + 1)}>
        Increment
      </button>
      <button onClick={undo}>Undo</button>
    </div>
  );
};

render(<Demo />);
```

To preserve memory you can limit number of steps that will be preserved in undo history.

```javascript
const [value, setValue, undo] = useUndoState(0, { maxSize: 30 });

// now when calling undo only last 30 changes to the value will be preserved
```

## Arguments

| Arguments    | Type    | Description                    | Default value  |
| ------------ | ------- | ------------------------------ | -------------- |
| initialValue | boolean | Initial value of the state     | false          |
| Options      | Object  | An options object for the hook | {maxSize: 100} |

Note: The second argument is an options object which currently accepts a maxSize which governs the maximum number of previous states to keep track of.

### Returned array items

| Returned Array items | Type     | Description                     |
| -------------------- | -------- | ------------------------------- |
| value                | Any      | Current value                   |
| setValue             | function | Setter function to update value |
| undo                 | function | Undo state value                |

## Codesandbox Example

## Basic usage

<iframe src="https://codesandbox.io/embed/useundostate-jy37w?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useUndoState"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
