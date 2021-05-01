# @rooks/use-keys 

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/keys/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-keys/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-keys.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-keys.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fkeys)




## About 
A hook which allows to setup callbacks when a combination of keys are pressed at the same time.

An important difference between `useKey` and `useKeys` is that `useKey` checks if **EITHER** of the keys in the list is pressed, while `useKeys` checks if **ALL** of the keys in the list are active. 

## Installation

```
npm install --save @rooks/use-keys
```

## Importing the hook

```javascript
import useKeys from "@rooks/use-keys";
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
