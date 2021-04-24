---
id: use-keys
title: use-keys
hide_title: true
sidebar_label: use-keys
---

# @rooks/use-keys

### A hook which allows to setup callbacks when a combination of keys are pressed at the same time.

An important difference between `useKey` and `useKeys` is that `useKey` checks if **EITHER** of the keys in the list is pressed, while `useKeys` checks if **ALL** of the keys in the list are active.

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-keys/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-keys.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-keys.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fkeys)



### Installation

    npm install --save @rooks/use-keys

### Importing the hook

```javascript
import useKeys from "@rooks/use-keys";
```

### Usage

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
      when: isEventActive
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
      target: inputRef
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

    