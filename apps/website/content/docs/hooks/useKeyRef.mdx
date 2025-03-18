---
id: useKeyRef
title: useKeyRef
sidebar_label: useKeyRef
---

## About

Very similar useKey but it returns a ref

[//]: # "Main"

## Examples

#### Basic example with keydown

```jsx
import { useKeyRef } from "rooks";
export default function App() {
  function vowelsEntered(e) {
    console.log("[Demo 1] You typed a vowel");
  }
  // window is the target
  const inputRef = useKeyRef(["a", "e", "i", "o", "u"], vowelsEntered);
  return (
    <>
      <p>Press a,e,i,o,u in the input to trigger a console.log statement</p>
      <input ref={inputRef} />
    </>
  );
}
```

#### Multiple handlers on the same element

```jsx
import { useKeyRef, useMergeRefs } from "rooks";
export default function App() {
  function vowelsEntered(e) {
    console.log("[Demo 1] You typed a vowel");
  }
  function capitalVowelsEntered(e) {
    console.log("[Demo 1] You typed a capital vowel");
  }
  // window is the target
  const keyRef1 = useKeyRef(["a", "e", "i", "o", "u"], vowelsEntered);
  const keyRef2 = useKeyRef(["A", "E", "I", "O", "U"], capitalVowelsEntered);
  const inputRef = useMergeRefs(keyRef1, keyRef2);
  return (
    <>
      <p>Press a,e,i,o,u in the input to trigger a console.log statement</p>
      <input ref={inputRef} />
    </>
  );
}
```

#### Multiple kinds of events

```jsx
import { useKeyRef } from "rooks";
export default function App() {
  function onKeyInteraction(e) {
    console.log("[Demo 2]Enter key", e.type);
  }

  const inputRef = useKeyRef(["Enter"], onKeyInteraction, {
    eventTypes: ["keypress", "keydown", "keyup"],
  });
  return (
    <>
      <p>Try "Enter" Keypress keydown and keyup </p>
      <p>
        It will log 3 events on this input. Since you can listen to multiple
        types of events on a keyboard key.
      </p>
      <input ref={inputRef} />
    </>
  );
}
```

#### Conditionally setting handlers

```jsx
import { useKeyRef } from "rooks";
export default function App() {
  const [shouldListen, setShouldListen] = useState(false);

  function toggleShouldListen() {
    setShouldListen(!shouldListen);
  }
  function onKeyInteraction(e) {
    console.log("[Demo 3] Enter key", e.type);
  }

  const inputRef = useKeyRef(["Enter"], onKeyInteraction, {
    eventTypes: ["keypress", "keydown", "keyup"],
    when: shouldListen,
  });
  return (
    <>
      <p>
        Enter key events will only be logged when the listening state is true.
        Click on the button to toggle between listening and not listening
        states.{" "}
      </p>
      <p>
        Handy for adding and removing event handlers only when certain
        conditions are met.
      </p>
      <input ref={inputRef} />
      <br />
      <button onClick={toggleShouldListen}>
        <b>{shouldListen ? "Listening" : "Not listening"}</b> - Toggle{" "}
      </button>
    </>
  );
}
```

### Arguments

| Argument value | Type     | Description                                            | Defualt   |
| -------------- | -------- | ------------------------------------------------------ | --------- |
| keyList        | Array    | A list of keys to listen                               | undefined |
| callback       | Function | Callback function to be called when event is triggered | undefined |
| options        | Object   | See table below                                        | undefined |

| Options value | Type                      | Description                                                                      | Defualt     |
| ------------- | ------------------------- | -------------------------------------------------------------------------------- | ----------- |
| when          | Boolean                   | Condition which if true, will enable the event listeners                         | true        |
| eventTypes    | Array of number or string | Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp | ['keydown'] |

### Returns

| Return value | Type         | Description                                              | Defualt   |
| ------------ | ------------ | -------------------------------------------------------- | --------- |
| ref          | Callback Ref | A ref that can be used on the element you want to listen | undefined |
