---
id: useSet
title: useSet
sidebar_label: useSet
---

## About

A React hook that tracks state in the form of a Set data structure.

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
function Demo() {
  const [set, { add, has, remove, removeAll }] = useSet(
    new Set(['hello', 1, 2])
  );

  return (
    <div>
      <button onClick={() => add(String(Date.now()))}>Add</button>
      <button onClick={() => removeAll()}>Reset</button>
      <button onClick={() => remove(1, 2)} disabled={!has(1) || !has(2)}>
        Remove 'hello'
      </button>
      <pre>{JSON.stringify(Array.from(set), null, 2)}</pre>
    </div>
  );
}

render(<Demo />);
```

---

## Codesandbox Examples

### Basic Usage

---

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
