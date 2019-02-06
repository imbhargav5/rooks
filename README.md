
<br/>
<br/>
<p align="center">
  <img src="https://i.gyazo.com/67b004be5aa811e9ccd8375b9ce274e1.png" height="300" style="margin: 200px 0" />
</p>
<br/>
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks)

<br/> 

Collection of regularly used custom hooks as utils for React

## [Website](https://react-hooks.org)

[![Image from Gyazo](https://i.gyazo.com/95e208eb09a97edee34eb65ef1be5367.png)](https://gyazo.com/95e208eb09a97edee34eb65ef1be5367)


# Features

 - [x] Collection of 22+ hooks as separate modules
 - [x] Standalone package with all the hooks at one place
 - [x] CommonJS, UMD and ESM Support

# Installation

###  For a specific hook like useDidMount

```
npm i -s @rooks/use-did-mount
```

```
npm i -s @rooks/use-interval
```


```jsx
import useDidMount from "@rooks/use-did-mount";
```


### For standalone build with all the hooks


```
npm i - s rooks
```


Import any hook from "rooks" and start using them!

```jsx
import { useDidMount } from "rooks";
```



# Usage

```jsx

function App() {
  useDidMount(() => {
    alert("mounted");
  });
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
```




## Packages

# @rooks/use-boundingclientrect

### getBoundingClientRect hook for React.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-boundingclientrect/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-boundingclientrect.svg) ![](https://img.shields.io/npm/dt/@rooks/use-boundingclientrect.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fboundingclientrect)


<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>


### Installation

```
npm install --save @rooks/use-boundingclientrect
```

### Importing the hook

```javascript
import useBoundingclientrect from "@rooks/use-boundingclientrect"
```

### Usage

```jsx
function Demo() {
  const myRef = useRef();
  const getBoundingClientRect = useBoundingclientrect(myRef);
  const [XOffset, setXOffset] = useState(0);
  const [YOffset, setYOffset] = useState(300);
  const displayString = JSON.stringify(getBoundingClientRect, null, 2);
  return (
    <>
      <div
        style={{
          width: 300,
          background: "lightblue",
          padding: "10px",
          position: "absolute",
          left: XOffset,
          top: YOffset
        }}
        ref={myRef}
      >
        <div
          style={{
            resize: "both",
            overflow: "auto",
            background: "white",
            color: "blue",
            maxWidth: "100%"
          }}
        >
          <p>
            Resize this div as you see fit. To demonstrate that it also updates
            on child dom nodes resize
          </p>
        </div>
        <h2>Bounds</h2>
        <p>
          <button onClick={() => setXOffset(XOffset - 5)}> Move Left </button>
          <button onClick={() => setXOffset(XOffset + 5)}> Move Right </button>
        </p>
        <p>
          <button onClick={() => setYOffset(YOffset - 5)}> Move Up </button>
          <button onClick={() => setYOffset(YOffset + 5)}> Move Down </button>
        </p>
      </div>
      <div style={{ height: 500 }}>
        <pre>{displayString}</pre>
      </div>
    </>
  );
}

render(<Demo/>)
```

### Arguments

| Argument | Type      | Description                                       |
| -------- | --------- | ------------------------------------------------- |
| ref      | React ref | React ref whose boundingClientRect is to be found |

### Return

| Return value | Type    | Description                                                                  | Default value |
| ------------ | ------- | ---------------------------------------------------------------------------- | ------------- |
| value        | DOMRect | DOMRect Object containing x,y, width, height, left,right,top and bottom keys | null          |

# @rooks/use-counter

### Counter hook for React.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-counter/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-counter.svg) ![](https://img.shields.io/npm/dt/@rooks/use-counter.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fcounter)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-counter
```

### Importing the hook

```javascript
import useCounter from "@rooks/use-counter"
```


### Usage

```jsx
function CounterComponent() {
  const {
    value,
    increment,
    decrement,
    incrementBy,
    decrementBy,
    reset
  } = useCounter(3);


  function incrementBy5(){
     incrementBy(5)
  }
  function decrementBy7(){
     decrementBy(7)
  }

  return <>
      Current value is {value}
      <hr/>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
      <button onClick={incrementBy5} >incrementBy5</button>
      <button onClick={decrementBy7} >decrementBy7</button>
      <hr/>
      <button onClick={reset}>reset</button>
  </>;
}

render(<CounterComponent/>)
```

### Arguments

| Argument     | Type   | Description                  |
| ------------ | ------ | ---------------------------- |
| initialValue | number | Initial value of the counter |


### Return

| Return value | Type   | Description                                                                 |
| ------------ | ------ | --------------------------------------------------------------------------- |
| counter      | Object | Object containing {value,increment,decrement,incrementBy,decrementBy,reset} |
# @rooks/use-did-mount

### componentDidMount hook for React
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-did-mount/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-did-mount.svg) ![](https://img.shields.io/npm/dt/@rooks/use-did-mount.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fdid-mount)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-did-mount
```

### Importing the hook

```javascript
import useDidMount from "@rooks/use-did-mount"
```


### Usage

```jsx
function Demo() {
  useDidMount(function(){
    console.log("mounted")
  });
  return null
}

render(<Demo/>)
```

### Arguments

| Argument | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| callback | function | function to be called on mount |

# @rooks/use-did-update

### componentDidUpdate hook for react

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-did-update/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-did-update.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-did-update.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fdid-update)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-did-update
```

### Importing the hook

```javascript
import useDidUpdate from "@rooks/use-did-update";
```

### Usage

```jsx
function Demo() {
  const [value, setValue] = useState(0);
  const [hasUpdated, setHasUpdated] = useState(false);
  useDidUpdate(() => {
    console.log("Update");
    setHasUpdated(true);
  }, [value]);
  return (
    <>
      <button onClick={() => setValue(value + 1)}>Value is {value}</button>
      <p>Has updated - {hasUpdated.toString()}</p>
      <p>Please check the console for logs.</p>
    </>
  );
}

render(<Demo />);
```
# `eslint-config`

> Eslint config for rooks

## Usage

```
const eslintConfig = require('eslint-config');

// TODO: DEMONSTRATE API
```
# @rooks/use-input

### Input hook for React.
<br/>


[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-input/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-input.svg) ![](https://img.shields.io/npm/dt/@rooks/use-input.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Finput)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>


### Installation

```
npm install --save @rooks/use-input
```

### Importing the hook

```javascript
import useInput from "@rooks/use-input"
```


### Usage

**Base**

```jsx
function Demo() {
  const myInput = useInput("hello");
  return (
    <div>
      <input {...myInput} />
      <p>
        Value is <b>{myInput.value}</b>
      </p>
    </div>
  );
}

render(<Demo/>)
```

**With optional validator**

```jsx
function Demo() {
  const myInput = useInput("hello", {
    validate: (newValue) => newValue.length < 15
  });
  return (
    <div>
      <p> Max length 15 </p>
      <input {...myInput} />
      <p>
        Value is <b>{myInput.value}</b>
      </p>
    </div>
  );
}

render(<Demo/>)
```

### Arguments

| Argument     | Type   | Description                 | Default value |
| ------------ | ------ | --------------------------- | ------------- |
| initialValue | string | Initial value of the string | ""            |
| opts         | object | Options                     | {}            |


### Options

| Option key | Type     | Description                                                                                                             | Default value |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ------------- |
| validate   | function | Validator function which receives changed valued before update as well as current value and should return true or false | undefined     |

### Return value

| Return value      | Type   | Description                                                                                                          |
| ----------------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| {value, onChange} | Object | Object containing {value : "String", onChange: "function that accepts an event and updates the value of the string"} |

# @rooks/use-interval

### setInterval hook for React.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-interval/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-interval.svg) ![](https://img.shields.io/npm/dt/@rooks/use-interval.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Finterval)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-interval
```

### Importing the hook

```javascript
import useInterval from "@rooks/use-interval"
```


### Usage

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      return state;
  }
}

function Demo() {
  const [value, dispatcher] = useReducer(reducer, { count: 0 });

  function increment() {
    dispatcher({
      type: "increment"
    });
  }

  const { start, stop } = useInterval(() => {
    increment();
  }, 1000);

  return (
    <>
      <p>value is {value.count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
render(<Demo/>)
```

### Arguments

| Argument         | Type     | Description                                              | Default value |
| ---------------- | -------- | -------------------------------------------------------- | ------------- |
| callback         | function | Function be invoked after each interval duration         | undefined     |
| intervalDuration | number   | Duration in milliseconds after which callback is invoked | undefined     |
| startImmediate   | boolean  | Should the timer start immediately or no                 | false         |

### Returned Object

| Returned object attributes | Type       | Description                |
| -------------------------- | ---------- | -------------------------- |
| start                      | function   | Start the interval         |
| stop                       | function   | Stop the interval          |
| intervalId                 | intervalId | IntervalId of the interval |
# @rooks/use-key

### keypress, keyup and keydown event handlers as hooks for react.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-key/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-key.svg) ![](https://img.shields.io/npm/dt/@rooks/use-key.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fkey)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-key
```

### Importing the hook

```javascript
import useKey from "@rooks/use-key";
```

### Usage

#### Basic example with keydown

```jsx
function Demo() {
  const inputRef = useRef();
  function windowEnter(e) {
    console.log("[Demo 1] Enter key was pressed on window");
  }
  function vowelsEntered(e) {
    console.log("[Demo 1] You typed a vowel");
  }
  function capitalVowelsEntered(e) {
    console.log("[Demo 1] You typed a capital vowel");
  }
  // window is the target
  useKey(["Enter"], windowEnter);
  useKey(["a", "e", "i", "o", "u"], vowelsEntered, {
    target: inputRef
  });
  useKey(["A", "E", "I", "O", "U"], capitalVowelsEntered, {
    target: inputRef
  });
  return (
    <>
      <p>Press enter anywhere to trigger a console.log statement</p>
      <p>Press a,e,i,o,u in the input to trigger a console.log statement</p>
      <p>Press A,E,I,O,U in the input to trigger a different log statement</p>
      <input ref={inputRef} />
    </>
  );
}

render(<Demo />);
```

#### Multiple kinds of events

```jsx
function Demo() {
  const inputRef = useRef();
  function onKeyInteraction(e) {
    console.log("[Demo 2]Enter key", e.type);
  }

  useKey(["Enter"], onKeyInteraction, {
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
  const inputRef = useRef();
  const [shouldListen, setShouldListen] = useState(false);
  function toggleShouldListen() {
    setShouldListen(!shouldListen);
  }
  function onKeyInteraction(e) {
    console.log("[Demo 3] Enter key", e.type);
  }

  useKey(["Enter"], onKeyInteraction, {
    target: inputRef,
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
# @rooks/use-localstorage

### Localstorage hook for React. Syncs with localstorage values across components and browser windows automatically.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-localstorage/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-localstorage.svg) ![](https://img.shields.io/npm/dt/@rooks/use-localstorage.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Flocalstorage)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

Sets and retrieves a key from localStorage and subscribes to it for updates across windows.

### Installation

```
npm install --save @rooks/use-localstorage
```

### Importing the hook

```javascript
import useLocalstorage from "@rooks/use-localstorage";
```

### Usage

```jsx
function Demo() {
  const { value, set, remove } = useLocalstorage("my-value", 0);
  return (
    <p>
      Value is {value}{" "}
      <button onClick={() => set(value !== null ? parseFloat(value) + 1 : 0)}>
        Increment
      </button>
      <button onClick={remove}>Remove </button>
    </p>
  );
}

render(<Demo />);
```
# @rooks/use-mouse

### Mouse position hook for React.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-mouse/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-mouse.svg) ![](https://img.shields.io/npm/dt/@rooks/use-mouse.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fmouse)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-mouse
```

### Importing the hook

```javascript
import useMouse from "@rooks/use-mouse"
```


### Usage

```jsx
function Demo() {
  const { x, y } = useMouse();
  return (
    <>
      <p> Move mouse here to see changes to position </p>
      <p>X position is {x || "null"}</p>
      <p>X position is {y || "null"}</p>
    </>
  );
}

render(<Demo/>)
```

### Returned Object 

| Returned object attributes | Type | Description         |
| -------------------------- | ---- | ------------------- |
| x                          | int  | X position of mouse |
| y                          | int  | Y position of mouse |
# @rooks/use-mutation-observer

### Mutation Observer hook for React.
<br/>


[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-mutation-observer/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-mutation-observer.svg) ![](https://img.shields.io/npm/dt/@rooks/use-mutation-observer.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fmutation-observer)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-mutation-observer
```

### Importing the hook

```javascript
import useMutationObserver from "@rooks/use-mutation-observer"
```


### Usage

```jsx
function Demo() {
  const myRef = useRef();
  const [mutationCount, setMutationCount] = useState(0);
  const incrementMutationCount = () => {
    return setMutationCount(mutationCount + 1);
  };
  useMutationObserver(myRef, incrementMutationCount);
  const [XOffset, setXOffset] = useState(0);
  const [YOffset, setYOffset] = useState(300);
  return (
    <>
      <div
        style={{
          width: 300,
          background: "lightblue",
          padding: "10px",
          position: "absolute",
          left: XOffset,
          top: YOffset
        }}
        ref={myRef}
      >
        <div
          style={{
            resize: "both",
            overflow: "auto",
            background: "white",
            color: "blue",
            maxWidth: "100%"
          }}
        >
          <p>
            Resize this div as you see fit. To demonstrate that it also updates
            on child dom nodes resize
          </p>
        </div>
        <h2>Bounds</h2>
        <p>
          <button onClick={() => setXOffset(XOffset - 5)}> Move Left </button>
          <button onClick={() => setXOffset(XOffset + 5)}> Move Right </button>
        </p>
        <p>
          <button onClick={() => setYOffset(YOffset - 5)}> Move Up </button>
          <button onClick={() => setYOffset(YOffset + 5)}> Move Down </button>
        </p>
      </div>
      <div style={{ height: 500 }} onClick={incrementMutationCount}>
        <pre>Mutation count {mutationCount}</pre>
      </div>
    </>
  );
}

render(<Demo/>)
```

### Arguments

| Argument | Type      | Description                                                                                       | Default value                                                           |
| -------- | --------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| ref      | React ref | Ref which should be observed for Mutations                                                        | undefined                                                               |
| callback | function  | Function which should be invoked on mutation. It is called with the `mutationList` and `observer` | undefined                                                               |
| config   | object    | Mutation Observer configuration                                                                   | {attributes: true,,characterData: true,,subtree: true,,childList: true} |

# @rooks/use-navigator-language

### Navigator Language hook for React.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-navigator-language/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-navigator-language.svg) ![](https://img.shields.io/npm/dt/@rooks/use-navigator-language.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fnavigator-language)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-navigator-language
```

### Importing the hook

```javascript
import useNavigatorLanguage from "@rooks/use-navigator-language";
```

### Usage

```jsx
function Demo() {
  const language = useNavigatorLanguage();
  return <p>Language is {language}</p>;
}

render(<Demo />);
```

### Return value

A language (String) is returned.
# @rooks/use-online

### Online status hook for React.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-online/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-online.svg) ![](https://img.shields.io/npm/dt/@rooks/use-online.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fonline)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-online
```

### Importing the hook

```javascript
import useOnline from "@rooks/use-online";
```

### Usage

```jsx
function Demo() {
  const isOnline = useOnline();
  return <p>Online status - {isOnline.toString()}</p>;
}

render(<Demo />);
```

### Return value

Offline status (boolean) is returned.
# @rooks/use-outside-click

### Outside click(for a ref) event as hook for React.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-outside-click/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-outside-click.svg) ![](https://img.shields.io/npm/dt/@rooks/use-outside-click.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Foutside-click)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-outside-click
```

### Importing the hook

```javascript
import useOutsideClick from "@rooks/use-outside-click";
```

### Usage

```jsx
function Demo() {
  const pRef = useRef();
  function outsidePClick() {
    alert("Clicked outside p");
  }
  useOutsideClick(pRef, outsidePClick);
  return (
    <div>
      <p ref={pRef}>Click outside me</p>
    </div>
  );
}

render(<Demo />);
```
# @rooks/use-previous

### Access the previous value of a variable with this React hook

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-previous/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-previous.svg) ![](https://img.shields.io/npm/dt/@rooks/use-previous.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fprevious)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-previous
```

### Importing the hook

```javascript
import usePrevious from "@rooks/use-previous";
```

### Usage

```jsx
function Demo() {
  const myInput = useInput("hello world");
  const previousValue = usePrevious(myInput.value);
  return (
    <div>
      <div>
        <input {...myInput} />
      </div>
      <p>
        Current value is <b>{myInput.value}</b>
      </p>
      <p>
        Previous value was <b>{previousValue || "-"}</b>
      </p>
    </div>
  );
}

render(<Demo />);
```

## Gif

[![Image from Gyazo](https://i.gyazo.com/9913f58e1959ed60fb590cb280639d88.gif)](https://gyazo.com/9913f58e1959ed60fb590cb280639d88)
# @rooks/use-raf

### A continuously running requestAnimationFrame hook for React

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-raf/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-raf.svg) ![](https://img.shields.io/npm/dt/@rooks/use-raf.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fraf)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

[![Image from Gyazo](https://i.gyazo.com/8c7393678112dc0cee575cbff570096d.gif)](https://gyazo.com/8c7393678112dc0cee575cbff570096d)

### Installation

```
npm install --save @rooks/use-raf
```

### Importing the hook

```javascript
import useRaf from "@rooks/use-raf";
```

### Usage

```jsx
let angle = 0;
function updateAngle() {
  angle = (angle + 3) % 360;
  return (angle * Math.PI) / 180;
}

function Demo() {
  const { value: shouldRun, toggleValue: toggleShouldRun } = useToggle(true);
  const myRef = useRef();
  const canvasRef = useRef();
  useRaf(() => {
    if (canvasRef && canvasRef.current) {
      const screenRatio = window.devicePixelRatio || 1;
      let angle = updateAngle();
      const canvas = canvasRef.current;
      var ctx = canvas.getContext("2d");
      ctx.save();
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.scale(screenRatio, screenRatio);
      ctx.fillStyle = "midnightblue";
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.fillStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.translate(50, 50);
      ctx.rotate(angle);
      ctx.fillRect(-20, -20, 40, 40);
      ctx.restore();
    }
  }, shouldRun);

  return (
    <>
      <h2>
        Request animation frame is now {shouldRun ? "" : "in"}active. Click to
        toggle.
      </h2>
      <p>
        <button onClick={toggleShouldRun}>Toggle Raf</button>{" "}
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: `100px`, width: `100%`, background: "grey" }}
      />
    </>
  );
}

render(<Demo />);
```
# `rooks`

Standalone build for all rooks. This package contains all the hooks built as part of the rooks project.

**Note:** If you only need a few hooks from the rooks package, it's prefereable to install individiual hooks from npm instead of the standalone rooks build. In other words, install `@rooks/use-did-mount` instead of `rooks` if you only need the `use-did-mount` functionality.

<br/>
<br/>
<p align="center">
  <img src="https://i.gyazo.com/67b004be5aa811e9ccd8375b9ce274e1.png" height="150" style="margin: 20px 0" />
</p>
<br/>
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/rooks/latest.svg) ![](https://img.shields.io/npm/l/rooks.svg) ![](https://img.shields.io/npm/dt/rooks.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fselect)

<br/>

## Installation

### For a specific hook like useDidMount

```
npm i -s @rooks/use-did-mount
```

```
npm i -s @rooks/use-interval
```

```jsx
import useDidMount from "@rooks/use-did-mount";
```

### For standalone build with all the hooks

```
npm i - s rooks
```

Import any hook from "rooks" and start using them!

```jsx
import { useDidMount } from "rooks";
```

# Usage

```jsx
function App() {
  useDidMount(() => {
    alert("mounted");
  });
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
```

<br/>

## Hope you like it!

Feel free to join as contributors!

:smile:

### License - MIT
# @rooks/use-select

### Select values from a list easily. List selection hook for react.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-select/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-select.svg) ![](https://img.shields.io/npm/dt/@rooks/use-select.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fselect)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-select
```

### Importing the hook

```javascript
import useSelect from "@rooks/use-select"
```


### Usage

```jsx

const list = [
  {
    heading: "Tab 1",
    content: "Tab 1 Content"
  },
  {
    heading: "Tab 2",
    content: "Tab 2 Content"
  }
];

function Demo() {
  const { index, setIndex, item } = useSelect(list, 0);
  return (
    <div>
      {list.map((listItem, listItemIndex) => (
        <button
          key={listItemIndex}
          style={{
            background: index === listItemIndex ? "dodgerblue" : "inherit"
          }}
          onClick={() => setIndex(listItemIndex)}
        >
          {listItem.heading}
        </button>
      ))}
      <p>{item.content}</p>
    </div>
  );
}
render(<Demo/>)
```

### Arguments

| Argument     | Type   | Description                                   | Default value |
| ------------ | ------ | --------------------------------------------- | ------------- |
| list         | Array  | List of items for which the selection is used | undefined     |
| initialIndex | number | Initially selected index                      | 0             |

### Returned Object

| Returned object attributes | Type     | Description                       |
| -------------------------- | -------- | --------------------------------- |
| index                      | int      | Index of currently selected index |
| item                       | any      | Currently selected item           |
| setIndex                   | function | Update selected index             |
| setItem                    | function | Update selected item              |
# @rooks/use-sessionstorage

### Session storage react hook. Easily manage session storage values.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-sessionstorage/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-sessionstorage.svg) ![](https://img.shields.io/npm/dt/@rooks/use-sessionstorage.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fsessionstorage)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-sessionstorage
```

### Importing the hook

```javascript
import useSessionstorage from "@rooks/use-sessionstorage";
```

### Usage

```jsx
function Demo() {
  const { value, set, remove } = useSessionstorage("my-value", 0);
  return (
    <p>
      Value is {value}{" "}
      <button onClick={() => set(value !== null ? parseFloat(value) + 1 : 0)}>
        Increment
      </button>
      <button onClick={remove}>Remove </button>
    </p>
  );
}

render(<Demo />);
```
# @rooks/use-time-ago

### A React Hook to get time ago for timestamp millisecond value.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-time-ago/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-time-ago.svg) ![](https://img.shields.io/npm/dt/@rooks/use-time-ago.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ftime-ago)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-time-ago
```

### Importing the hook

```javascript
import useTimeAgo from "@rooks/use-time-ago"
```


### Usage

```jsx
function Demo() {
  const [date, setDate] = useState(new Date());
  const timeAgo = useTimeAgo(date.getTime() - 1000 * 12, {
    locale: "zh_CN"
  });
  const timeAgo2 = useTimeAgo(date.getTime() - 1000 * 12);
  return (
    <>
      <p>{timeAgo}</p>
      <p>{timeAgo2}</p>
    </>
  );
}

render(<Demo/>)
```

### Arguments

| Argument | Type   | Description    | Default value      |
| -------- | ------ | -------------- | ------------------ |
| input    | Date   | Timestamp      | etc                | Any input that time-ago.js supports | undefined |
| options  | Object | Options object | {   intervalMs:0 } |

#### Options

| Options      | Type         | Description                                                            | Default value |
| ------------ | ------------ | ---------------------------------------------------------------------- | ------------- |
| intervalMs   | milliseconds | Duration after which time-ago has to be calculated                     | 1000          |
| locale       | String       | Locale in which value is expected                                      | undefined     |
| relativeDate | Date         | Relative date object with respect to which time-ago is to be calcuated | Current Time  |

### Returned Value

Timeago string is returned.

# @rooks/use-timeout

### setTimeout hook for react.
<br/>


[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-timeout/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-timeout.svg) ![](https://img.shields.io/npm/dt/@rooks/use-timeout.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ftimeout)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-timeout
```

### Importing the hook

```javascript
import useTimeout from "@rooks/use-timeout"
```


### Usage

```jsx
function TimeoutComponent() {
  function doAlert() {
    window.alert("timeout expired!");
  }
  const { start, clear } = useTimeout(doAlert, 2000);
  return (
    <>
      <button onClick={start}> Start timeout </button>
      <button onClick={clear}> Clear timeout </button>
    </>
  );
}

render(<TimeoutComponent/>)
```

### Arguments

| Arguments | Type     | Description                                              | Default value |
| --------- | -------- | -------------------------------------------------------- | ------------- |
| callback  | function | Function to be executed in timeout                       | undefind      |
| delay     | Number   | Number in milliseconds after which callback is to be run | 0             |

### Returned Object keys

| Returned object attributes | Type     | Description       |
| -------------------------- | -------- | ----------------- |
| clear                      | function | Clear the timeout |
| start                      | function | Start the timeout |

# @rooks/use-toggle

### Toggle (between booleans or custom data)hook for React.
<br/>


[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-toggle/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-toggle.svg) ![](https://img.shields.io/npm/dt/@rooks/use-toggle.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ftoggle)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-toggle
```

### Importing the hook

```javascript
import useToggle from "@rooks/use-toggle"
```


### Usage

```jsx

const customToggleFunction = v => (v === "start" ? "stop" : "start");

function Demo() {
  const  [value1, toggleValue1] = useToggle();
  const [value2, toggleValue2]  = useToggle(true);
  const [value3, toggleValue3]  = useToggle(
    "start",
    customToggleFunction
  );

  return (
    <>
      <section>
        <h3>Base</h3>
        <button onClick={toggleValue1}>{value1.toString()}</button>
        <hr />
      </section>
      <section>
        <h3>Initial true</h3>
        <button onClick={toggleValue2}>{value2.toString()}</button>
        <hr />
      </section>
      <section>
        <h3>Custom values</h3>
        <button onClick={toggleValue3}>{value3}</button>
      </section>
    </>
  );
}

render(<Demo/>)
```

### Arguments

| Arguments      | Type     | Description                                     | Default value |
| -------------- | -------- | ----------------------------------------------- | ------------- |
| initialValue   | boolean  | Initial value of the state                      | false         |
| toggleFunction | function | Function which determines how to toggle a value | v => !v       |


### Returned object keys

| Returned object attributes | Type     | Description                                                                                                           |
| -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| value                      | Any      | Current value                                                                                                         |
| toggleValue                | function | Toggle function which changes the value to the other value in the list of 2 acceptable values. (Mostly true or false) |
# @rooks/use-visibility-sensor

### Visibility sensor hook for React.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-visibility-sensor/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-visibility-sensor.svg) ![](https://img.shields.io/npm/dt/@rooks/use-visibility-sensor.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fvisibility-sensor)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>


### Installation

```
npm install --save @rooks/use-visibility-sensor
```

### Importing the hook

```javascript
import useVisibilitySensor from "@rooks/use-visibility-sensor"
```


### Usage

```jsx

function Demo() {
    const rootNode = useRef(null);
    const { isVisible, visibilityRect } = useVisibilitySensor(rootNode, {
        intervalCheck: false,
        scrollCheck: true,
        resizeCheck: true
    });
    return (
        <div ref={rootNode}>
        <p>
            {isVisible ? "Visible" : isVisible === null ? "Null" : "Not Visible"}
        </p>
        </div>
    );
}

render(<Demo/>)
```

It checks whether an element has scrolled into view or not. A lot of the logic is taken from [react-visibility-sensor](https://github.com/joshwnj/react-visibility-sensor) and is rewritten for the hooks proposal.

> **Note:** This is using the new [React Hooks API Proposal](https://reactjs.org/docs/hooks-intro.html)
> which is subject to change until React 16.7 final.
>
> You'll need to install `react`, `react-dom`, etc at `^16.7.0-alpha.0`

## Demo

[![Image from Gyazo](https://i.gyazo.com/98634bb2a962733670d798d1e754d63e.gif)](https://gyazo.com/98634bb2a962733670d798d1e754d63e)

### Returned Object keys

| Returned object attributes | Type    | Description                                                 |
| -------------------------- | ------- | ----------------------------------------------------------- |
| isVisible                  | Boolean | Is Ref visible or not                                       |
| visibilityRect             | Object  | VisibilityRectangle containing coordinates of the container |

## Options

The first argument of the `useVisibilitySensor` hook is a ref, the second argument is an options object. The available options are as follow:

`intervalCheck: false` - Accepts `int | bool`, if an `int` is supplied, that will be the interval in `ms` and it keeps checking for visibility

`partialVisibility: false` - Accepts `bool | string` : Tells the hook if partial visibility should be considered as visibility or not. Accepts `false` and directions `top`, `bottom`, `left` and `right`
`containment: null` - A `DOMNode` element which defaults to `window`. The element relative to which visibility is checked against

`scrollCheck: true` - A `bool` to determine whether to check for scroll behavior or not

`scrollDebounce: 250` - The debounce ms for scroll

`scrollThrottle: -1` - The throttle ms for scroll. If throttle > -1, debounce is ignored.

`resizeCheck: false` - A `bool` to determine whether to check for resize behavior or not

`resizeDebounce: 250` - The debounce ms for resize

`resizeThrottle: -1` - The throttle ms for resize. If throttle > -1, debounce is ignored.

`shouldCheckOnMount: true` - A `bool` which determines whether an initial check on first render should happen or not.

`minTopValue: 0` - An `int` top value to determine what amount of top visibility should be considered for `visibility`

## Todo

- [x] Init
- [x] Scroll and Resize support
- [x] Debounce and throttling
- [x] Option to opt-out of initial check on mount
- [x] Documentation of all options
- [x] Tests _ WIP _
- [ ] More examples _ WIP _
# Rooks website

### Rooks website built with next.js.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>
# @rooks/use-will-unmount

### componentWillUnmount lifecycle as hook for React.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-will-unmount/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-will-unmount.svg) ![](https://img.shields.io/npm/dt/@rooks/use-will-unmount.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fwill-unmount)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-will-unmount
```

### Importing the hook

```javascript
import useWillUnmount from "@rooks/use-will-unmount"
```


### Usage

```jsx

function Message(){

  useWillUnmount(function () {
    alert("unmounted")
  })
  return <p> Message </p>
}


function Demo() {
  const [
    value,
    changeValue
   ] = useState(true);

  function toggleValue(){
    changeValue(!value)
  }

  return <>
    <p><button onClick={toggleValue}>Toggle show </button></p>
    {value && <Message/>}
  </>;
}

render(<Demo/>)
```

### Arguments

| Arguments | Type     | Description                                     | Default value |
| --------- | -------- | ----------------------------------------------- | ------------- |
| callback  | function | Callback function which needs to run on unmount | undefined     |

# A React hook for componentWillUnmount lifecycle method.
# @rooks/use-window-size

### Window size hook for React.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-window-size/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-window-size.svg) ![](https://img.shields.io/npm/dt/@rooks/use-window-size.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fwindow-size)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-window-size
```
### Importing the hook

```javascript
import useWindowSize from "@rooks/use-window-size"
```



### Usage

```jsx
function WindowComponent() {
  const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize();

  return (
    <div>
      <p>
        <span>innerHeight - </span>
        <span>{innerHeight}</span>
      </p>
      <p>
        <span>innerWidth - </span>
        <span>{innerWidth}</span>
      </p>
      <p>
        <span>outerHeight - </span>
        <span>{outerHeight}</span>
      </p>
      <p>
        <span>outerWidth - </span>
        <span>{outerWidth}</span>
      </p>
    </div>
  );
}
render(<WindowComponent/>)
```

### Returned Object keys

| Returned object attributes | Type | Description            |
| -------------------------- | ---- | ---------------------- |
| width                      | int  | inner width of window  |
| height                     | int  | inner height of window |
| outerWidth                 | int  | outer height of window |
| outerHeight                | int  | outer width of window  |


# @rooks/use-worker

### Worker hook for React.
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-worker/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-worker.svg) ![](https://img.shields.io/npm/dt/@rooks/use-worker.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fworker)

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
