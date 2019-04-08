import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useSessionstorage from "@rooks/use-sessionstorage";

function UseSessionstorageDemo() {
  const { value, set, remove } = useSessionstorage("my-value", 0);
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

storiesOf("useSessionstorage", module).add("basic example", () => (
  <UseSessionstorageDemo />
));
