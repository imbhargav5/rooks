---
id: useKeyBindings
title: useKeyBindings
sidebar_label: useKeyBindings
---

## About

useKeyBindings can bind multiple keys to multiple callbacks and fire the callbacks on key press.

[//]: # 'Main'

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useKeyBindings } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const cb1 = () => console.log('cb1');
  const cb2 = () => console.log('cb2');
  const cb3 = () => console.log('cb3');

  useKeyBindings({ 1: cb1, 2: cb2, Enter: cb3 });

  return (
    <div>
      <input type="text" />
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
