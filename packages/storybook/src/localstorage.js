import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useLocalstorage from "@rooks/use-localstorage";
import README from "@rooks/use-localstorage/README.md";

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

storiesOf("useLocalstorage", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <UseLocalstorageDemo />);
