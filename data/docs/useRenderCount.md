---
id: useRenderCount
title: useRenderCount
sidebar_label: useRenderCount
---

## About

Get the render count of a component

## Examples

```jsx
import { useRenderCount } from "rooks";

export default function App() {
  const renderCount = useRenderCount();

  return (
    <div>
      <h1>Component render count</h1>
      <p>This component has rendered {renderCount} times.</p>
    </div>
  );
}
```
