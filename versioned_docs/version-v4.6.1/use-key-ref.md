---
id: use-key-ref
title: use-key-ref
sidebar_label: use-key-ref
---


    

## About

Very similar useKey but it returns a ref

[//]: # "Main"

## Installation

    npm install --save @rooks/use-key-ref

## Importing the hook

```javascript
import useKeyRef from "@rooks/use-key-ref"
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
  const inputRef = useMergeRefs(keyRef1, keyRef2)
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
    target: inputRef,
    eventTypes: ["keypress", "keydown", "keyup"]
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
    when: shouldListen
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


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    