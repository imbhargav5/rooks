import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useDebounce from "@rooks/use-debounce";
import README from "@rooks/use-debounce/README.md";

function DebouncedDemo() {
  const [value, setValue] = useState(0);
  const fn = useDebounce(() => {
    console.log("run");
    setValue(value + 1);
  }, 500);
  return (
    <div>
      <p>Click fast!</p>
      <button onClick={fn}>Click me</button>
      <p> Clicked count {value} </p>
    </div>
  );
}

storiesOf("useDebounce", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <DebouncedDemo />);
