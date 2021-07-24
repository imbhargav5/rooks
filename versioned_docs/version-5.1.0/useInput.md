---
id: useInput
title: useInput
sidebar_label: useInput
---

## About

Input hook for React.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useInput } from 'rooks';
```

## Usage

**Base**

```jsx
function Demo() {
  const myInput = useInput('hello');
  return (
    <div>
      <input {...myInput} />
      <p>
        Value is <b>{myInput.value}</b>
      </p>
    </div>
  );
}

render(<Demo />);
```

**With optional validator**

```jsx
function Demo() {
  const myInput = useInput('hello', {
    validate: (newValue) => newValue.length < 15,
  });
  return (
    <div>
      <p> Max length 15 </p>
      <input {...myInput} />
      <p>
        Value is <b>{myInput.value}</b>
      </p>
    </div>
  );
}

render(<Demo />);
```

### Arguments

| Argument     | Type   | Description                 | Default value |
| ------------ | ------ | --------------------------- | ------------- |
| initialValue | string | Initial value of the string | ""            |
| opts         | object | Options                     | {}            |

### Options

| Option key | Type     | Description                                                                                                             | Default value |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ------------- |
| validate   | function | Validator function which receives changed valued before update as well as current value and should return true or false | undefined     |

### Return value

| Return value      | Type   | Description                                                                                                          |
| ----------------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| {value, onChange} | Object | Object containing {value : "String", onChange: "function that accepts an event and updates the value of the string"} |

## Codesandbox Examples

### Basic Usage

<iframe 
    src="https://codesandbox.io/embed/useinput-forked-oxzxj?fontsize=14&hidenavigation=1&theme=dark"
       style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
    title="useInput"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
