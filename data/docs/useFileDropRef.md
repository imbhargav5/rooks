---
id: useFileDropRef
title: useFileDropRef
sidebar_label: useFileDropRef
---

## About

Drop files easily

## Examples

```tsx
import { useFileDropRef } from "rooks";
export default function App() {
  useFileDropRef();
  return null;
}
```

## Robustness and lifecycle

When a drop exceeds `maxFiles`, every file is rejected. `onDrop` receives an empty accepted array and the complete rejected array, while `onFileRejected` is invoked once per file.
