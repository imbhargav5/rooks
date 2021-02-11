---
id: use-worker
title: use-worker
sidebar_label: use-worker
---

   

## About

Worker hook for React.
<br/>

## Installation

    npm install --save @rooks/use-worker

## Importing the hook

```javascript
import useWorker from "@rooks/use-worker"
```

## Usage

```react

function Demo() {
  const [value, setValue] = useState(0);
  const [error, setError] = useState(null);
  const worker = useWorker("/worker.js", {
    onMessage: e => {
      console.log("message received from worker");
      console.log(e.data);
      setValue(e.data);
    },
    onMessageError: e => {
      console.log(e);
    }
  });
  return value;
}

const rootElement = document.getElementById("root");

ReactDOM.render(<Demo />, rootElement);
```

### Arguments

| Arguments  | Type   | Description                                                                                                       | Default value                                     |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| scriptPath | string | Path to the script file that a new Worker is to be created with                                                   | undefined                                         |
| options    | Object | Options object within which `onMessage` and `onMessageError` options can be passed to communicate with the worker | `{onMessage: () => {},,onMessageError: () => {}}` |

### Returned Object

The worker instance is returned.


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    