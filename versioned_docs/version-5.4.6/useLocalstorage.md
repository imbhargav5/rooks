---
id: useLocalstorage
title: useLocalstorage
sidebar_label: useLocalstorage
---

## About

Localstorage hook for React. Syncs with localstorage values across components and browser windows automatically. Sets and retrieves a key from localStorage and subscribes to it for updates across windows.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useLocalstorage } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const [value, set, remove] = useLocalstorage('my-value', 0);
  // Can also be used as {value, set, remove}

  return (
    <p>
      Value is {value}
      <button onClick={() => set(value !== null ? value + 1 : 0)}>
        Increment
      </button>
      <button onClick={remove}>Remove </button>
    </p>
  );
}

render(<Demo />);
```

## Codesandbox Example

### Basic Usage

<iframe src="https://codesandbox.io/embed/usevisibilitysensor-ej29y?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useVisibilitySensor"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
