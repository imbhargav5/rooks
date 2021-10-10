---
id: useKeyBindings
title: useKeyBindings
sidebar_label: useKeyBindings
---

## About

useKeyBindings can bind pairs of keyboard events and handlers.

[//]: # "Main"

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useKeyBindings } from "rooks";
```

## Usage

```jsx
function Demo() {
  const cb1 = () => console.log("cb1");
  const cb2 = () => console.log("cb2");
  const cb3 = () => console.log("cb3");

  useKeyBindings({ 1: cb1, 2: cb2, Enter: cb3 });

  return (
    <div>
      <input type="text" />
    </div>
  );
}

render(<Demo />);
```

### Arguments

| Argument    | Type    | Description                           | Default value |
| ----------- | ------- | ------------------------------------- | ------------- |
| keyBindings | Object  | pairs of keyboard events and handlers | {}            |
| options     | Options | refer to useKey                       | {}            |

---

## Codesandbox Examples

### Basic Usage

<iframe
  src="https://codesandbox.io/embed/usekeybindings-97ppz?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="useKeyBindings usage"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

---

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
