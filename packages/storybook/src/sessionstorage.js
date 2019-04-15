import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useSessionstorage from "@rooks/use-sessionstorage";
import README from "@rooks/use-sessionstorage/README.md";

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

storiesOf("useSessionstorage", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <UseSessionstorageDemo />);
