---
id: use-undo-state
title: use-undo-state
sidebar_label: use-undo-state
---

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

Drop in replacement for useState hook but with undo functionality.

## Installation

    npm install --save @rooks/use-undo-state

## Importing the hook

```javascript
import useUndoState from '@rooks/use-undo-state'
```

## Usage

```jsx
const Demo = () => {
  const [value, setValue, undo] = useUndoState(0)

  return (
    <div>
      <span>Current value: {value}</span>
      <button onClick={() => setValue(value + 1)}>
        Increment
      </button>
      <button onClick={undo}>
        Undo
      </button>
    </div>
  )
}

render(<Demo/>)
```

You can pass any kind of value to hook just like React's own useState.

```jsx
const Demo = () => {
  const [value, setValue, undo] = useUndoState({ data: 42 })

  return (
    <div>
      <span>Current value: {value}</span>
      <button onClick={() => setValue({ data: value.data + 1 })}>
        Increment object data
      </button>
      <button onClick={undo}>
        Undo
      </button>
    </div>
  )
}

render(<Demo/>)
```

Setter function can also be used with callback just like React's own useState.

```javascript
const [value, setValue, undo] = useUndoState({ data: 42 })

() => setValue(current => current + 1)
```

```jsx
const Demo = () => {
  const [value, setValue, undo] = useUndoState(0)

  return (
    <div>
      <span>Current value: {value}</span>
      <button onClick={() => setValue(current => current + 1)}>
        Increment
      </button>
      <button onClick={undo}>
        Undo
      </button>
    </div>
  )
}

render(<Demo/>)
```

To preserve memory you can limit number of steps that will be preserved in undo history.

```javascript
const [value, setValue, undo] = useUndoState(0, { maxSize: 30 })

// now when calling undo only last 30 changes to the value will be preserved
```

## Arguments

| Arguments      | Type     | Description                                     | Default value |
| -------------- | -------- | ----------------------------------------------- | ------------- |
| initialValue   | boolean  | Initial value of the state                      | false         |
| Options | Object | An options object for the hook | {maxSize: 100}       |

Note: The second argument is an options object which currently accepts a maxSize which governs the maximum number of previous states to keep track of.

### Returned array items

| Returned Array items | Type     | Description                                                                                                           |
| -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| value                | Any      | Current value                                                                                                         |
| setValue          | function | Setter function to update value |
| undo          | function | Undo state value |


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    