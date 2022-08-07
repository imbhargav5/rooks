---
id: useKeys
title: useKeys
sidebar_label: useKeys
---

## About

A hook which allows to setup callbacks when a combination of keys are pressed at the same time.

## Note

An important difference between `useKey` and `useKeys` is that `useKey` checks if **EITHER** of the keys in the list is pressed, while `useKeys` checks if **ALL** of the keys in the list are active.

## Examples

```jsx
import * as React from "react";
import { useKeys } from "rooks";
export default function App() {
  const containerRef = React.useRef(document);
  const inputRef = React.useRef(null);
  const [isEventActive, setIsEventActive] = React.useState(true);
  const [firstCallbackCallCount, setFirstCallbackCallCount] = React.useState(0);
  useKeys(
    ["ControlLeft", "KeyS"],
    () => {
      alert("you presses ctrlLeft + s");
      setFirstCallbackCallCount(curr => curr + 1);
    },
    {
      target: containerRef,
      when: isEventActive,
      preventLostKeyup: true,
    }
  );
  useKeys(
    ["m", "r"],
    event => {
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
```

### Arguments

| Argument value | Type     | Description                                            | Defualt   |
| -------------- | -------- | ------------------------------------------------------ | --------- |
| keyList        | Array    | A list of keys to listen                               | undefined |
| callback       | Function | Callback function to be called when event is triggered | undefined |
| options        | Object   | See table below                                        | undefined |

| Options value    | Type                      | Description                                                                      | Defualt     |
| ---------------- | ------------------------- | -------------------------------------------------------------------------------- | ----------- |
| when             | Boolean                   | Condition which if true, will enable the event listeners                         | true        |
| eventTypes       | Array of number or string | Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp | ['keydown'] |
| target           | HTMLElement ref           | target ref on which the events should be listened.                               | window      |
| preventLostKeyup | Boolean                   | Prevent keyup events get lost tracking when alert is triggered.                  | false       |

### Returns

No return value
