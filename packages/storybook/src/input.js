import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useInput from "@rooks/use-input";
import README from "@rooks/use-input/README.md";

storiesOf("useInput", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <InputDemo />);

function InputDemo() {
  const myInput = useInput("hello");
  return (
    <div>
      <input {...myInput} />
      <p>
        Value is <b>{myInput.value}</b>
      </p>
    </div>
  );
}
