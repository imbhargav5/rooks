---
id: useSessionstorage
title: useSessionstorage
sidebar_label: useSessionstorage
---

:::warning

`useSessionstorage` is deprecated, it will be removed in rooks v7. Please use [useSessionstorageState](./useSessionstorageState) instead.

:::

## About

Session storage react hook. Easily manage session storage values.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useSessionstorage } from "rooks";
```

## Usage

```jsx
function Demo() {
  const [value, set, remove] = useSessionstorage("my-value", 0);
  // Can also be used as {value, set, remove}

  return (
    <p>
      Value is {value}{" "}
      <button onClick={() => set(value !== null ? parseFloat(value) + 1 : 0)}>
        Increment
      </button>
      <button onClick={remove}>Remove </button>
    </p>
  );
}

render(<Demo />);
```

### Arguments

| Arguments    | Type   | Description                      | Default value |
|--------------|--------|----------------------------------|---------------|
| key          | string | Key of the value to be stored    | undefined      |
| defaultValue | any    | Default value of the stored item | null          |

### Returned items

```javascript
// can be an array or object
const [value, set, remove] = useSessionstorage("my-value", 0);
const {value, set, remove} = useSessionstorage("my-value", 0);
```

| Returned items | Type                    | Description                               |
|----------------|-------------------------|-------------------------------------------|
| value          | any                     | the value stored in sessionStorage        |
| set            | (newValue: any) => void | Set the value to `newValue`            |
| remove         | () => void              | Remove the value stored in sessionStorage |

## Codesandbox Example

### Basic Usage

<iframe src="https://codesandbox.io/embed/usesessionstorage-svipc?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useSessionstorage"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
