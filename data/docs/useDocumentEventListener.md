---
id: useDocumentEventListener
title: useDocumentEventListener
sidebar_label: useDocumentEventListener
---

## About

A react hook to an event listener to the document object

[//]: # "Main"

## Examples

```jsx
import { useDocumentEventListener } from "rooks";
import { useState, useEffect } from "react";

export default function App() {
  const [myState, setMyState] = useState(0);

  useDocumentEventListener("click", function() {
    setMyState(myState + 1);
  });

  return (
    <div className="App">
      <h1>useDocumentEventListener Example</h1>
      <br></br>
      <h1>Clicked {myState} times</h1>
    </div>
  );
}
```

### Arguments

| Arguments      | Type     | Description                                    | Default value |
| -------------- | -------- | ---------------------------------------------- | ------------- |
| eventName      | string   | The event to track                             | undefind      |
| callback       | function | The callback to be called on event             | undefined     |
| conditions     | object   | The options to be passed to the event listener | {}            |
| isLayoutEffect | boolean  | Should it use layout effect. Defaults to false | false         |

### Return

No return value.
