# @rooks/use-key-ref

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/key-ref/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-key-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-key-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-key-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fkey-ref)



## About
Very similar useKey but it returns a ref


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-key-ref
```

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
