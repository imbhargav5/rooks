import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useLocalstorage from "@rooks/use-localstorage";
import README from "@rooks/use-localstorage/README.md";

/**
 * Array Destructuring
 */
function UseLocalstorageDemo() {
  const [myValue, setMyValue, removeMyValue] = useLocalstorage("my-value", 0);
  return (
    <>
      <h1>Please check localstorage for changes</h1>
      <p>
        Value is {myValue}
        <button onClick={() => setMyValue(myValue !== null ? myValue + 1 : 0)}>
          Increment
        </button>
        <button onClick={removeMyValue}>Remove </button>
      </p>
    </>
  );
}

/**
 * Object Destructuring
 */
function UseLocalstorageDemoObject() {
  const { value, set, remove } = useLocalstorage("my-value", 0);
  return (
    <>
      <h1>Please check localstorage for changes</h1>
      <p>
        Value is {value}
        <button onClick={() => set(value !== null ? value + 1 : 0)}>
          Increment
        </button>
        <button onClick={remove}>Remove </button>
      </p>
    </>
  );
}

storiesOf("useLocalstorage", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <UseLocalstorageDemo />)
  .add("use object destructuring", () => <UseLocalstorageDemoObject />);
