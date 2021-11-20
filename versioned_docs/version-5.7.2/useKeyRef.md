---
id: useKeyRef
title: useKeyRef
sidebar_label: useKeyRef
---

## About

Very similar useKey but it returns a ref

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useKeyRef } from "rooks";
```

## Usage

#### Basic example with keydown

```jsx
function Demo() {
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

render(<Demo />);
```

#### Multiple handlers on the same element

```jsx
function Demo() {
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

render(<Demo />);
```

#### Multiple kinds of events

```jsx
function Demo() {
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
render(<Demo />);
```

#### Conditionally setting handlers

```jsx
function Demo() {
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

### Returns

| Return value | Type         | Description                                              | Defualt   |
|--------------|--------------|----------------------------------------------------------|-----------|
| ref          | Callback Ref | A ref that can be used on the element you want to listen | undefined |

---

## Codesandbox Examples

### Basic Usage

<iframe
  src="https://codesandbox.io/embed/fun-usekeyref-usage-ifh09?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="Fun useKeyRef usage"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>


## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
