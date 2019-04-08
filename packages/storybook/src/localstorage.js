import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useLocalstorage from "@rooks/use-localstorage";

function UseLocalstorageDemo() {
  const { value, set, remove } = useLocalstorage("my-value", 0);
  return (
    <>
      <h1>Please check localstorage for changes</h1>
      <p>
        Value is {value}{" "}
        <button onClick={() => set(value !== null ? parseFloat(value) + 1 : 0)}>
          Increment
        </button>
        <button onClick={remove}>Remove </button>
      </p>
    </>
  );
}

storiesOf("useLocalstorage", module).add("basic example", () => (
  <UseLocalstorageDemo />
));
