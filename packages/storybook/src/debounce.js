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

function DebouncedDemoEvents() {
  const [value, setValue] = useState("");
  const [autocompleteValue, setAutocompleteValue] = useState("");

  const onChange = e => {
    setValue(e.target.value);
    updateAutocomplete(e);
  };
  const updateAutocomplete = useDebounce(e => {
    setAutocompleteValue(e.target.value);
  }, 500);

  return (
    <div>
      <form>
        <h1>Type value and watch the second value change with debounce!</h1>
        <fieldset>
          <label htmlFor="value">Typed value</label>
          <input id="value" value={value} onChange={onChange} />
        </fieldset>
        <fieldset>
          <p>This value is a debounced version of typed value</p>
          <label htmlFor="autocomplete">Value used for autocomplete.</label>
          <input id="autocomplete" disabled value={autocompleteValue} />
        </fieldset>
      </form>
    </div>
  );
}

storiesOf("useDebounce", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <DebouncedDemo />)
  .add("events example", () => <DebouncedDemoEvents />);
