---
id: useDisposable
title: useDisposable
sidebar_label: useDisposable
---

## About

⚠️ **Experimental Hook**: Import this hook from `rooks/experimental`. It may change or be removed without notice.

Bridges TC39 [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) (`Symbol.dispose`) with React component lifecycles.

This hook requires explicit resource management symbol support at runtime. Browsers such as Safari need a polyfill like `core-js/proposals/explicit-resource-management`.

### The problem

React's `useEffect` cleanup and the `using` keyword solve the same underlying problem — disposing a resource when it is no longer needed — but they exist in separate worlds. A `using` declaration ties disposal to a **block scope**; React components are not blocks, they **re-render**. Wiring the two up manually looks like this:

```tsx
// Before — manual wiring
useEffect(() => {
  const ws = new MyWebSocket(url); // implements Symbol.dispose
  return () => ws[Symbol.dispose]();
}, [url]);
```

`useDisposable` does that wiring for you:

```tsx
// After — declarative
const ws = useDisposable(() => new MyWebSocket(url), [url]);
```

Unlike `useAsyncDisposable`, this hook returns the resource **synchronously** (guaranteed non-null on every render) because the factory runs during the render phase.

> **When NOT to use this hook:** If the resource emits change events that should drive re-renders, reach for `useSyncExternalStore` instead. `useDisposable` is best for resources whose lifecycle matters but whose internal state is not reflected in the React tree.

## Examples

### WebSocket wrapper

```tsx
import { useDisposable } from "rooks/experimental";

class ManagedWebSocket implements Disposable {
  private socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(url);
  }

  send(data: string) {
    this.socket.send(data);
  }

  [Symbol.dispose]() {
    this.socket.close();
  }
}

function Chat({ roomUrl }: { roomUrl: string }) {
  const ws = useDisposable(
    () => new ManagedWebSocket(roomUrl),
    [roomUrl] // closes old socket and opens new one when roomUrl changes
  );

  return (
    <button onClick={() => ws.send("hello")}>Send</button>
  );
}
```

### Event emitter with automatic listener cleanup

```tsx
import { useDisposable } from "rooks/experimental";
import { EventEmitter } from "events";

class ScopedEmitter implements Disposable {
  private emitter: EventEmitter;
  private listeners: Array<[string, (...args: unknown[]) => void]> = [];

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  on(event: string, handler: (...args: unknown[]) => void) {
    this.emitter.on(event, handler);
    this.listeners.push([event, handler]);
  }

  [Symbol.dispose]() {
    for (const [event, handler] of this.listeners) {
      this.emitter.off(event, handler);
    }
  }
}

function Dashboard({ emitter }: { emitter: EventEmitter }) {
  const scope = useDisposable(() => new ScopedEmitter(emitter), [emitter]);

  scope.on("data", (payload) => {
    console.log("received", payload);
  });

  return <div>Listening…</div>;
}
```

### Managed lock (Web Locks API)

```tsx
import { useDisposable } from "rooks/experimental";

class ManagedLock implements Disposable {
  private release?: () => void;

  constructor(private name: string) {
    navigator.locks.request(name, (lock) => {
      return new Promise<void>((resolve) => {
        this.release = resolve;
      });
    });
  }

  [Symbol.dispose]() {
    this.release?.();
  }
}

function ExclusiveEditor({ docId }: { docId: string }) {
  const _lock = useDisposable(
    () => new ManagedLock(`doc:${docId}`),
    [docId]
  );

  return <textarea />;
}
```

### Before vs after

```tsx
// ❌ Before — manual useEffect cleanup
function Component({ id }) {
  useEffect(() => {
    const conn = openConnection(id);
    return () => conn[Symbol.dispose]();
  }, [id]);
  // conn not accessible outside the effect
}

// ✅ After — useDisposable
function Component({ id }) {
  const conn = useDisposable(() => openConnection(id), [id]);
  // conn is available in render and event handlers
  return <button onClick={() => conn.query("SELECT 1")}>Run</button>;
}
```

## Arguments

| Argument  | Type                        | Description                                                                                        | Default value |
| --------- | --------------------------- | -------------------------------------------------------------------------------------------------- | ------------- |
| factory   | `() => T`                   | Function that synchronously creates and returns a `Disposable` resource                            | _required_    |
| deps      | `DependencyList`            | Dependency array — when deps change, the old resource is disposed and the factory is called again  | `[]`          |

## Return value

| Return value | Type | Description                                                                |
| ------------ | ---- | -------------------------------------------------------------------------- |
| resource     | `T`  | The disposable resource — always non-null, available synchronously         |

## Notes

- **Two hooks, not one.** `useDisposable` and `useAsyncDisposable` are intentionally separate. Making one hook that handles both cases would force the sync path to return `T | null`, punishing the common synchronous case with an unnecessary null check.
- **React Strict Mode.** The hook handles the mount → unmount → remount cycle correctly. In development Strict Mode, the factory is called twice (once per mount); the first resource is disposed as part of Strict Mode's effect-idempotency check.
- **Deps semantics** are identical to `useEffect` deps — use the same rules (primitive values, stable references).
