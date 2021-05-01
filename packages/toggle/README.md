# @rooks/use-toggle

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/toggle/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-toggle/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-toggle.svg) ![](https://img.shields.io/npm/dt/@rooks/use-toggle.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ftoggle)




## About 
Toggle (between booleans or custom data)hook for React.
<br/>

## Installation

```
npm install --save @rooks/use-toggle
```

## Importing the hook

```javascript
import useToggle from "@rooks/use-toggle"
```


## Usage

```jsx

const customToggleFunction = v => (v === "start" ? "stop" : "start");

function Demo() {
  const  [value1, toggleValue1] = useToggle();
  const [value2, toggleValue2]  = useToggle(true);
  const [value3, toggleValue3]  = useToggle(
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

## Arguments

| Arguments      | Type     | Description                                     | Default value |
| -------------- | -------- | ----------------------------------------------- | ------------- |
| initialValue   | boolean  | Initial value of the state                      | false         |
| toggleFunction | function | Function which determines how to toggle a value | v => !v       |


### Returned array items

| Returned Array items | Type     | Description                                                                                                           |
| -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| value                | Any      | Current value                                                                                                         |
| toggleValue          | function | Toggle function which changes the value to the other value in the list of 2 acceptable values. (Mostly true or false) |
