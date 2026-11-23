---
"rooks": patch
---

Improve hook types without changing runtime behavior: `useWindowEventListener`, `useDocumentEventListener`, and `useEventListenerRef` now infer the callback's event type from the event name, `useWebWorker` accepts an optional `TMessage` type parameter for `postMessage`, and `useNotification` types `data` as `unknown`. Existing callbacks and type arguments remain valid.
