import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import useKeys from "@rooks/use-keys";
import README from "@rooks/use-keys/README.md";

// .add("multiple events on keys", () => <MultipleEvents />)
// .add("toggling listeners using `when` ", () => (
//   <TogglingListenersWithBoolean />
// ));

function Basic() {
  const containerRef = React.useRef(document);
  const inputRef = React.useRef(null);
  const [isEventActive, setIsEventActive] = React.useState(true);
  const [firstCallbackCallCount, setFirstCallbackCallCount] = React.useState(0);
  useKeys(
    ["ControlLeft", "KeyS"],
    () => {
      console.log("you presses ctrlLeft + s");
      setFirstCallbackCallCount(firstCallbackCallCount + 1);
    },
    {
      target: containerRef,
      when: isEventActive
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
      {/* <div className="grid-container">
        <input ref={inputRef} className="box1" tabIndex={1} />
      </div> */}
    </div>
  );
}

function PressAndHoldSingle() {
  const [left, setLeft] = useState(0);
  useKeys(
    ["KeyD"],
    () => {
      setLeft(left + 5);
    },
    {
      continuous: true
    }
  );

  return (
    <div data-testid="container">
      <p>Press and hold d to move the div to the right</p>
      <div
        style={{
          position: "relative",
          left,
          height: 100,
          width: 200,
          background: "red"
        }}
      >
        Move me
      </div>
    </div>
  );
}

function PressAndHoldCombination() {
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  useKeys(
    ["ControlLeft", "KeyD"],
    () => {
      setLeft(left + 5);
    },
    {
      continuous: true
    }
  );

  useKeys(
    ["ControlLeft", "KeyW"],
    () => {
      setTop(top - 5);
    },
    {
      continuous: true
    }
  );

  useKeys(
    ["ControlLeft", "KeyA"],
    () => {
      setLeft(left - 5);
    },
    {
      continuous: true
    }
  );
  useKeys(
    ["ControlLeft", "KeyS"],
    () => {
      setTop(top + 5);
    },
    {
      continuous: true
    }
  );
  return (
    <div data-testid="container">
      <p>Press and hold ctrl + d to move the div to the right</p>
      <p>Press and hold ctrl + w to move the div to the top</p>
      <p>Press and hold ctrl + s to move the div to the bottom</p>
      <p>Press and hold ctrl + a to move the div to the left</p>
      <div
        style={{
          position: "relative",
          left,
          top,
          height: 100,
          width: 200,
          background: "red"
        }}
      >
        Move me
      </div>
    </div>
  );
}

storiesOf("usekeys", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("Basic example", () => <Basic />)
  .add("Press and hold single key example", () => <PressAndHoldSingle />)
  .add("Press and hold multiple keys example", () => (
    <PressAndHoldCombination />
  ));
