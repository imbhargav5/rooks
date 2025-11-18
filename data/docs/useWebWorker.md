---
id: useWebWorker
title: useWebWorker
sidebar_label: useWebWorker
---

## About

React hook for simplified Web Worker management with message passing. Offload heavy computations to background threads without blocking the UI.

## Installation

```bash
npm install rooks
```

## Usage

First, create a worker file (e.g., `public/worker.js`):

```javascript
// worker.js
self.onmessage = function(e) {
  const { type, value } = e.data;

  if (type === 'compute') {
    // Perform heavy computation
    let result = 0;
    for (let i = 0; i < value; i++) {
      result += i;
    }
    // Send result back to main thread
    self.postMessage(result);
  }
};
```

Then use the hook in your React component:

```jsx
import { useWebWorker } from "rooks";

function HeavyComputationComponent() {
  const { postMessage, data, status, error, terminate, isSupported } =
    useWebWorker<number>("/worker.js");
  const [inputValue, setInputValue] = useState(1000000);

  const handleCompute = () => {
    postMessage({ type: "compute", value: inputValue });
  };

  const handleTerminate = () => {
    terminate();
  };

  if (!isSupported) {
    return <div>Web Workers are not supported in this browser</div>;
  }

  return (
    <div>
      <h2>Web Worker Demo</h2>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(Number(e.target.value))}
      />
      <button onClick={handleCompute} disabled={status === "running"}>
        {status === "running" ? "Computing..." : "Start Computation"}
      </button>
      <button onClick={handleTerminate}>Terminate Worker</button>

      <div>
        <p>Status: <strong>{status}</strong></p>
        {data !== null && <p>Result: {data}</p>}
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      </div>
    </div>
  );
}
```

## Return Value

Returns an object with the following properties:

| Property    | Type                      | Description                              |
| ----------- | ------------------------- | ---------------------------------------- |
| postMessage | `(message: any) => void`  | Post a message to the web worker         |
| terminate   | `() => void`              | Terminate the web worker                 |
| status      | `WorkerStatus`            | Current status of the worker             |
| data        | `T \| null`               | Last data received from the worker       |
| error       | `Error \| null`           | Any error that occurred                  |
| isSupported | `boolean`                 | Whether Web Workers are supported        |

## Worker Status

The `status` property can have the following values:

- `"idle"` - Worker initialized but no messages sent
- `"running"` - Worker is currently processing a message
- `"success"` - Worker successfully completed processing
- `"error"` - An error occurred
- `"terminated"` - Worker has been terminated

## Features

- **Background processing** - Offload heavy computations without blocking UI
- **Message passing** - Simple API for communication with workers
- **Status tracking** - Monitor worker state throughout its lifecycle
- **Error handling** - Comprehensive error handling and reporting
- **Automatic cleanup** - Workers are automatically terminated on unmount
- **TypeScript support** - Full type definitions with generics for data typing

## Use Cases

- Heavy mathematical computations
- Data processing and parsing
- Image/video manipulation
- Cryptographic operations
- Any CPU-intensive tasks that would block the main thread

## Browser Support

Web Workers are supported in:
- Chrome 4+
- Firefox 3.5+
- Safari 4+
- Edge 12+
- Opera 10.6+

## Notes

- Worker scripts must be served from the same origin or use CORS
- Workers cannot access the DOM directly
- Workers have their own global scope and cannot access window objects
- Communication with workers is done via message passing
- Workers are automatically terminated when the component unmounts
- Large data transfers can be optimized using Transferable Objects
