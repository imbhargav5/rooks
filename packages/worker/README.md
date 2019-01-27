# @rooks/use-worker

### Worker hook for React.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-worker/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-worker.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-worker.svg)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-worker
```

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
