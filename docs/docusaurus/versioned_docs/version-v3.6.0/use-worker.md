---
id: use-worker
title: use-worker
hide_title: true
sidebar_label: use-worker
---

# @rooks/use-worker

### Worker hook for React.

<br/>

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-worker/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-worker.svg) ![](https://img.shields.io/npm/dt/@rooks/use-worker.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fworker)



### Installation

    npm install --save @rooks/use-worker

### Importing the hook

```javascript
import useWorker from "@rooks/use-worker"
```

### Usage

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

    