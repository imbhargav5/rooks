---
id: useSet
title: useSet
sidebar_label: useSet
---

## About

React state hook that tracks a Set.

[//]: # 'Main'

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useSet } from 'rooks';
```

## Usage

```jsx
const Demo = () => {
  const [set, { add, has, remove, toggle, reset }] = useSet(new Set(['hello']));

  return (
    <div>
      <button onClick={() => add(String(Date.now()))}>Add</button>
      <button onClick={() => reset()}>Reset</button>
      <button onClick={() => remove('hello')} disabled={!has('hello')}>
        Remove 'hello'
      </button>
      <button onClick={() => toggle('hello')}>Toggle hello</button>
      <pre>{JSON.stringify(Array.from(set), null, 2)}</pre>
    </div>
  );
};

render(<Demo />);
```

---

## Codesandbox Examples

### Basic Usage

---

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
