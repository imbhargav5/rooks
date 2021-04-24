---
id: use-toggle
title: use-toggle
hide_title: true
sidebar_label: use-toggle
---

# @rooks/use-toggle

### Toggle (between booleans or custom data)hook for React.

<br/>

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-toggle/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-toggle.svg) ![](https://img.shields.io/npm/dt/@rooks/use-toggle.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ftoggle)



### Installation

    npm install --save @rooks/use-toggle

### Importing the hook

```javascript
import useToggle from "@rooks/use-toggle"
```

### Usage

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

    