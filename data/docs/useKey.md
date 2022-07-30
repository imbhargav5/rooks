---
id: useKey
title: useKey
sidebar_label: useKey
---

## About

keypress, keyup and keydown event handlers as hooks for react.

## Examples

## Basic example with keydown

```jsx
import React, { useRef, useState } from "react";
import "./styles.css";
import { useDebounce, useKey, useThrottle, useTimeoutWhen } from "rooks";

export default function App() {
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
    target: inputRef,
  });
  useKey(["A", "E", "I", "O", "U"], capitalVowelsEntered, {
    target: inputRef,
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
```

### Multiple kinds of events

```jsx
import React, { useRef, useState } from "react";
import "./styles.css";
import { useDebounce, useKey, useThrottle, useTimeoutWhen } from "rooks";

export default function App() {
  const inputRef = useRef();
  function onKeyInteraction(e) {
    console.log("[Demo 2]Enter key", e.type);
  }

  useKey(["Enter"], onKeyInteraction, {
    target: inputRef,
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

### Conditionally setting handlers

```jsx
import React, { useRef, useState } from "react";
import "./styles.css";
import { useDebounce, useKey, useThrottle, useTimeoutWhen } from "rooks";

export default function App() {
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

### Fun little game

```jsx
import React, { useRef, useState } from "react";
import "./styles.css";
import { useDebounce, useKey, useThrottle, useTimeoutWhen } from "rooks";
import random from "random";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const colors = [
  "#1D4ED8",
  "#6D28D9",
  "#92400E",
  "#047857",
  "#DC2626",
  "#374151",
  "##BE185D",
];

export const Root = styled.div`
  position: fixed;
  top: 0;
  height: 100%;
  left: 0;
  width: 100%;
`;

export function useMapState(initialValue) {
  const [map, setMap] = useState(initialValue);

  function set(key, value) {
    setMap({
      ...map,
      [key]: value,
    });
  }
  function has(key) {
    return typeof map[key] !== "undefined";
  }
  function setMultiple(...obj) {
    setMap({
      ...map,
      ...obj,
    });
  }
  function removeMultiple(...keys) {
    const newMap = {};
    Object.keys(map).forEach(key => {
      if (!keys.includes(key)) {
        newMap[key] = map[key];
      }
    });
    setMap(newMap);
  }
  function remove(key) {
    const newMap = {};
    Object.keys(map).forEach(mapKey => {
      if (mapKey !== key) {
        newMap[mapKey] = map[mapKey];
      }
    });
    setMap(newMap);
  }
  function removeAll() {
    setMap({});
  }

  const controls = {
    set,
    has,
    setMultiple,
    remove,
    removeMultiple,
    removeAll,
  };
  return [map, controls];
}

const KeyWrapper = styled(motion.div)`
  height: 60px;
  width: 60px;
  position: absolute;
  background: dodgerblue;
  display: flex;
  place-content: center;
  color: white;
  border-radius: 6px;
  border: 1px solid dodgerblue;
  place-items: center;
  ${props => {
    return `
      background: ${props.background};
      transform: rotateZ(${props.rotation}deg);
      left: ${props.leftOffset}%;
    `;
  }}
`;

function getVariants(topOffset) {
  return {
    initial: {
      top: "100%",
      opacity: 0,
      scale: 0.5,
    },
    visible: {
      top: `${topOffset}%`,
      opacity: 1,
      scale: 1,
      rotate: 720 + random.int(-45, 45),
      transition: {
        duration: 1,
      },
    },
    exit: {
      top: "-100%",
      opacity: 0,
      scale: 0.5,
      rotate: 2160,
      transition: {
        duration: 0.5,
      },
    },
  };
}

function KeyDiv({ keyData, removeKey }) {
  const { rotation, bgRandomInt, topOffset, text, leftOffset } = keyData;

  useTimeoutWhen(removeKey, 2000);

  return (
    <KeyWrapper
      variants={getVariants(topOffset)}
      initial="initial"
      animate="visible"
      exit="exit"
      //transition={{ duration: 2 }}
      rotation={rotation}
      background={colors[bgRandomInt]}
      leftOffset={leftOffset}
    >
      {text}
    </KeyWrapper>
  );
}

export function RenderKeys({ keyMap, removeKey }) {
  return (
    <AnimatePresence>
      {Object.entries(keyMap).map(([mapkey, keyData]) => {
        return (
          <KeyDiv
            key={mapkey}
            keyData={keyData}
            removeKey={() => removeKey(mapkey)}
          />
        );
      })}
    </AnimatePresence>
  );
}

const Alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const allKeysToHandle = Alphabets.map(key => `Key${key}`);

function createKeyData(alphabetKeyCode) {
  return {
    text: alphabetKeyCode.split("Key")[1],
    rotation: random.int(-3, 3) * 15,
    bgRandomInt: random.int(0, 100) % 6,
    topOffset: random.int(10, 80),
    leftOffset: random.int(10, 80),
  };
}

function Main() {
  const [keyMap, { set, remove }] = useMapState({});
  const dirtyCounterRef = useRef(0);

  function addKey(alphabetKeyCode) {
    dirtyCounterRef.current = dirtyCounterRef.current + 1;
    set(dirtyCounterRef.current, createKeyData(alphabetKeyCode));
  }

  const [throttledAddkey] = useThrottle(addKey, 500);
  // harmless forloop
  // hook count is the same so this is fine
  allKeysToHandle.forEach(alphabetKeyCode => {
    useKey(alphabetKeyCode, () => {
      throttledAddkey(alphabetKeyCode);
    });
  });

  useTimeoutWhen(() => {
    addKey("KeyA");
  }, 500);
  useTimeoutWhen(() => {
    addKey("KeyS");
  }, 1500);
  useTimeoutWhen(() => {
    addKey("KeyD");
  }, 2500);
  useTimeoutWhen(() => {
    addKey("KeyF");
  }, 3500);

  console.log(keyMap);

  return (
    <Root>
      <RenderKeys keyMap={keyMap} removeKey={remove} />
    </Root>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>Type any key</h1>
      <Main />
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

| Options value | Type                      | Description                                                                      | Defualt     |
| ------------- | ------------------------- | -------------------------------------------------------------------------------- | ----------- |
| when          | Boolean                   | Condition which if true, will enable the event listeners                         | true        |
| eventTypes    | Array of number or string | Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp | ['keydown'] |
| target        | HTMLElement ref           | target ref on which the events should be listened.                               | window      |

### Returns

No return value
