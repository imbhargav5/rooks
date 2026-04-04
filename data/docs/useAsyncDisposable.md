---
id: useAsyncDisposable
title: useAsyncDisposable
sidebar_label: useAsyncDisposable
---

## About

Bridges TC39 [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) (`Symbol.asyncDispose`) with React component lifecycles.

### The problem

React's `useEffect` cleanup and the `await using` keyword solve the same problem — releasing a resource when it is no longer needed — but they live in separate worlds. `await using` ties disposal to a **block scope**; React components are not blocks, they **re-render** and can unmount at any time, including while an async factory is still running.

Handling that correctly by hand requires a disposed-flag pattern:

```tsx
// Before — manual wiring with race condition guard
useEffect(() => {
  let disposed = false;
  let db: MyDatabase | null = null;

  openDatabase(userId).then((instance) => {
    if (!disposed) {
      db = instance;
      setDb(instance);
    } else {
      instance[Symbol.asyncDispose]();
    }
  });

  return () => {
    disposed = true;
    db?.[Symbol.asyncDispose]();
    db = null;
    setDb(null);
  };
}, [userId]);
```

`useAsyncDisposable` does all of that for you:

```tsx
// After — declarative
const db = useAsyncDisposable(() => openDatabase(userId), [userId]);
if (db === null) return <Spinner />;
```

> **When NOT to use this hook:** If the resource emits change events that should drive re-renders, reach for `useSyncExternalStore` instead. `useAsyncDisposable` is best for resources whose lifecycle matters but whose internal state is not reflected in the React tree.

## Examples

### IndexedDB connection

```tsx
import { useAsyncDisposable } from "rooks";

class ManagedIDBConnection implements AsyncDisposable {
  private db: IDBDatabase;

  constructor(db: IDBDatabase) {
    this.db = db;
  }

  transaction(stores: string[], mode: IDBTransactionMode) {
    return this.db.transaction(stores, mode);
  }

  async [Symbol.asyncDispose]() {
    this.db.close();
  }
}

async function openManagedIDB(name: string): Promise<ManagedIDBConnection> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, 1);
    req.onsuccess = () => resolve(new ManagedIDBConnection(req.result));
    req.onerror = () => reject(req.error);
  });
}

function UserStore({ userId }: { userId: string }) {
  const db = useAsyncDisposable(
    () => openManagedIDB(`user:${userId}`),
    [userId]
  );

  if (db === null) return <p>Opening database…</p>;

  return (
    <button onClick={() => {
      const tx = db.transaction(["items"], "readonly");
      // ...
    }}>
      Read items
    </button>
  );
}
```

### WebGPU device

```tsx
import { useAsyncDisposable } from "rooks";

class ManagedGPUDevice implements AsyncDisposable {
  constructor(
    public readonly adapter: GPUAdapter,
    public readonly device: GPUDevice
  ) {}

  async [Symbol.asyncDispose]() {
    this.device.destroy();
  }
}

async function requestGPUDevice(): Promise<ManagedGPUDevice> {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No GPU adapter");
  const device = await adapter.requestDevice();
  return new ManagedGPUDevice(adapter, device);
}

function Renderer() {
  const gpu = useAsyncDisposable(() => requestGPUDevice(), []);

  if (gpu === null) return <p>Initializing GPU…</p>;

  return <canvas id="webgpu-canvas" />;
}
```

### Scoped document lock with deps (Web Locks API)

```tsx
import { useAsyncDisposable } from "rooks";

class ScopedLock implements AsyncDisposable {
  private release?: () => void;
  readonly acquired: boolean;

  constructor(release: () => void) {
    this.release = release;
    this.acquired = true;
  }

  async [Symbol.asyncDispose]() {
    this.release?.();
    this.release = undefined;
  }
}

async function acquireLock(name: string): Promise<ScopedLock> {
  return new Promise((resolve) => {
    navigator.locks.request(name, (lock) => {
      return new Promise<void>((releaseLock) => {
        resolve(new ScopedLock(releaseLock));
      });
    });
  });
}

function DocumentEditor({ docId }: { docId: string }) {
  // Lock changes with docId — old lock released, new one acquired
  const lock = useAsyncDisposable(
    () => acquireLock(`doc:${docId}`),
    [docId]
  );

  if (lock === null) return <p>Acquiring lock…</p>;

  return <textarea />;
}
```

### Before vs after

```tsx
// ❌ Before — manual wiring, verbose and error-prone
function Component({ userId }) {
  const [db, setDb] = useState(null);

  useEffect(() => {
    let disposed = false;
    let handle = null;

    openDatabase(userId).then((instance) => {
      if (!disposed) {
        handle = instance;
        setDb(instance);
      } else {
        instance[Symbol.asyncDispose]();
      }
    });

    return () => {
      disposed = true;
      handle?.[Symbol.asyncDispose]();
      handle = null;
      setDb(null);
    };
  }, [userId]);

  if (!db) return <Spinner />;
  return <div>{db.version}</div>;
}

// ✅ After — useAsyncDisposable
function Component({ userId }) {
  const db = useAsyncDisposable(() => openDatabase(userId), [userId]);

  if (db === null) return <Spinner />;
  return <div>{db.version}</div>;
}
```

## Arguments

| Argument | Type                  | Description                                                                                        | Default value |
| -------- | --------------------- | -------------------------------------------------------------------------------------------------- | ------------- |
| factory  | `() => Promise<T>`    | Async function that creates and returns an `AsyncDisposable` resource                              | _required_    |
| deps     | `DependencyList`      | Dependency array — when deps change, the old resource is disposed and the factory is called again  | `[]`          |

## Return value

| Return value | Type       | Description                                                           |
| ------------ | ---------- | --------------------------------------------------------------------- |
| resource     | `T \| null` | The disposable resource, or `null` while the factory is still resolving |

## Notes

- **Race conditions.** If the component unmounts (or deps change) while the factory promise is still pending, the arriving resource is disposed immediately and the component never receives it. This mirrors the `lastCallId` pattern used in `useAsyncEffect`.
- **Two hooks, not one.** `useDisposable` and `useAsyncDisposable` are intentionally separate. The sync variant guarantees `T` (never null); merging the two would force every caller to handle `null`, even when the factory is synchronous.
- **React Strict Mode.** The hook handles the mount → unmount → remount cycle correctly. In development, the factory is called twice; the first resource is disposed as part of Strict Mode's effect-idempotency check.
- **Deps semantics** are identical to `useEffect` deps — use the same rules (primitive values, stable references).
