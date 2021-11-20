---
id: useKeys
title: useKeys
sidebar_label: useKeys
---

## About

A hook which allows to setup callbacks when a combination of keys are pressed at the same time.

## Note

An important difference between `useKey` and `useKeys` is that `useKey` checks if **EITHER** of the keys in the list is pressed, while `useKeys` checks if **ALL** of the keys in the list are active.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useKeys } from "rooks";
```

## Usage

```jsx
function Demo() {
  const containerRef = React.useRef(document);
  const inputRef = React.useRef(null);
  const [isEventActive, setIsEventActive] = React.useState(true);
  const [firstCallbackCallCount, setFirstCallbackCallCount] = React.useState(0);
  useKeys(
    ["ControlLeft", "KeyS"],
    () => {
      alert("you presses ctrlLeft + s");
      setFirstCallbackCallCount(firstCallbackCallCount + 1);
    },
    {
      target: containerRef,
      when: isEventActive,
    }
  );
  useKeys(
    ["m", "r"],
    (event) => {
      // event.stopPropagation();
      console.log("here you go m and r");
    },
    {
      when: isEventActive,
      target: inputRef,
    }
  );
  return (
    <div data-testid="container">
      <p data-testid="first-callback">
        Callback Run Count:
        {firstCallbackCallCount}
      </p>
      <p>Is events enabled ? ==> {isEventActive ? "Yes" : "No"}</p>
      <p>Press CtrlLeft + s to see update in count</p>
      <button
        onClick={() => {
          setIsEventActive(!isEventActive);
        }}
      >
        Toggle event enabled
      </button>
      <div className="grid-container">
        <input ref={inputRef} className="box1" tabIndex={1} />
      </div>
    </div>
  );
}

render(<Demo />);
```

### Arguments

| Argument value | Type     | Description                                            | Defualt   |
|----------------|----------|--------------------------------------------------------|-----------|
| keyList        | Array    | A list of keys to listen                               | undefined |
| callback       | Function | Callback function to be called when event is triggered | undefined |
| options        | Object   | See table below                                        | undefined |

| Options value | Type                      | Description                                                                      | Defualt     |
|---------------|---------------------------|----------------------------------------------------------------------------------|-------------|
| when          | Boolean                   | Condition which if true, will enable the event listeners                         | true        |
| eventTypes    | Array of number or string | Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp | ['keydown'] |
| target        | HTMLElement ref           | target ref on which the events should be listened.                               | window      |

### Returns

No return value


## Codesandbox Examples

### Basic Usage

<iframe
  src="https://codesandbox.io/embed/smoosh-fire-uzlde?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="useKeys usage"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>


## Join Bhargav's discord server


You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
