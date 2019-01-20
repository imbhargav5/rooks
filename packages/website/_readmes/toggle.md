# @rooks/use-toggle

### Installation

```
npm install --save @rooks/use-toggle
```

### Usage

```jsx

const customToggleFunction = v => (v === "start" ? "stop" : "start");

function Demo() {
  const { value: value1, toggleValue: toggleValue1 } = useToggle();
  const { value: value2, toggleValue: toggleValue2 } = useToggle(true);
  const { value: value3, toggleValue: toggleValue3 } = useToggle(
    "start",
    customToggleFunction
  );

  return (
    <>
      <section>
        <h3>Base</h3>
        <button onClick={toggleValue1}>{value1.toString()}</button>
        <hr />
      </section>
      <section>
        <h3>Initial true</h3>
        <button onClick={toggleValue2}>{value2.toString()}</button>
        <hr />
      </section>
      <section>
        <h3>Custom values</h3>
        <button onClick={toggleValue3}>{value3}</button>
      </section>
    </>
  );
}

render(<Demo/>)
```

### Arguments

| Arguments      | Type     | Description                                     | Default value |
| -------------- | -------- | ----------------------------------------------- | ------------- |
| initialValue   | boolean  | Initial value of the state                      | false         |
| toggleFunction | function | Function which determines how to toggle a value | v => !v       |


### Returned object keys

| Returned object attributes | Type     | Description                                                                                                           |
| -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| value                      | Any      | Current value                                                                                                         |
| toggleValue                | function | Toggle function which changes the value to the other value in the list of 2 acceptable values. (Mostly true or false) |

Toggle hook for React.
