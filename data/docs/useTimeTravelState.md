---
id: useTimeTravelState
title: useTimeTravelState
sidebar_label: useTimeTravelState
---

## About

A hook that manages state which can undo and redo. A more powerful version of useUndoState hook.

## Examples

### Basic example

```tsx
import { useTimeTravelState } from "rooks";
export default function App() {
  const [value, setValue, controls] = useTimeTravelState(0);

  return (
    <div>
      <span>Current value: {value}</span>
      <br />
      <p>
        <span>Can undo: {String(controls.canUndo)}</span>
        <span>Can redo: {String(controls.canRedo)}</span>
      </p>
      <br />
      <button onClick={() => setValue(value + 1)}>Increment</button>
      <button onClick={controls.undo}>Undo</button>
      <button onClick={controls.redo}>Redo</button>
    </div>
  );
}
```
