---
id: useToggle
title: useToggle
sidebar_label: useToggle
---

## About

Toggle (between booleans or custom data)hook for React.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useToggle } from 'rooks';
```

## Usage

```jsx
const customToggleFunction = (v) => (v === 'start' ? 'stop' : 'start');

function Demo() {
  const [value1, toggleValue1] = useToggle();
  const [value2, toggleValue2] = useToggle(true);
  const [value3, toggleValue3] = useToggle('start', customToggleFunction);

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

render(<Demo />);
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

## Codesandbox Example

### Basic Usage

<iframe src="https://codesandbox.io/embed/usetoggle-twmx7?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useToggle"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
