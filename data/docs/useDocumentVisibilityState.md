---
id: useDocumentVisibilityState
title: useDocumentVisibilityState
sidebar_label: useDocumentVisibilityState
---

## About

Returns the visibility state of the document. Returns `null` on the server.

## Examples

```tsx
import {useEffect} from 'react'
import {useDocumentVisibilityState} from "rooks"

export default function App() {
  const isDocumentVisible =  useDocumentVisibilityState();
  useEffect(() => {
    console.log(isDocumentVisible)
  }, [isDocumentVisible])
  return <p>Try switching to a different tab and check console </p>
}
```
