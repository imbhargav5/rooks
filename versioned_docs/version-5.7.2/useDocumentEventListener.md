---
id: useDocumentEventListener
title: useDocumentEventListener
sidebar_label: useDocumentEventListener
---

## About

A react hook to an event listener to the document object

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useDocumentEventListener } from "rooks";
```

## Usage

```jsx
function Demo() {
  const [myState, setMyState] = useState(0);

  useDocumentEventListener("click", function () {
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

render(<Demo />);
```

### Arguments

| Arguments      | Type     | Description                                    | Default value |
|----------------|----------|------------------------------------------------|---------------|
| eventName      | string   | The event to track                             | undefind      |
| callback       | function | The callback to be called on event             | undefined     |
| conditions     | object   | The options to be passed to the event listener | {}            |
| isLayoutEffect | boolean  | Should it use layout effect. Defaults to false | false         |

### Return

No return value.

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/usedocumenteventlistener-ebpcc?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useDocumentEventListener"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
