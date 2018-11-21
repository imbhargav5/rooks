# @rooks/use-worker

### Installation

```
npm install --save @rooks/use-worker
```

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import useWorker from "./useWorker";
import "./styles.css";

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
