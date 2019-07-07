import React from "react";
import { storiesOf } from "@storybook/react";
import useKeys from "@rooks/use-keys";
import README from "@rooks/use-keys/README.md";

storiesOf("usekeys", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("Basic example", () => <Basic />)
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
      alert("you presses ctrlLeft + s")
      setFirstCallbackCallCount(firstCallbackCallCount + 1);
    },
    {
      target: containerRef,
      when: isEventActive
    }
  );
  // useKeys(
  //   ["m", "r"],
  //   event => {
  //     // event.stopPropagation();
  //     console.log("here you go m and r");
  //   },
  //   {
  //     when: isEventActive,
  //     target: inputRef
  //   }
  // );
  // console.log("rendering ");
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