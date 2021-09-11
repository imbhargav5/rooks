---
id: useRefElement
title: useRefElement
sidebar_label: useRefElement
---

## About

Helps bridge gap between callback ref and state. Manages the element called with callback ref api using state variable.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useRefElement } from "rooks";
```

## Usage

```jsx
// Build a useEventListenerRef hook using useRefElement
function useEventListenerRef(eventName, callback) {
  const [ref, element] = useRefElement();

  useEffect(() => {
    if (!(element && element.addEventListener)) {
      return;
    }
    element.addEventListener(eventName, callback);
    return () => {
      element.removeEventListener(eventName, callback);
    };
  }, [element, eventName, callback]);

  return ref;
}
```

### Arguments

No arguments.

### Returns an array of two items

| Returned items | Type                                      | Description                   |
|----------------|-------------------------------------------|-------------------------------|
| ref            | (refElement: RefElementOrNull<T>) => void | The callback ref              |
| element        | RefElementOrNull<T>                       | The element linked to the ref |


## Codesandbox Example

### Basic usage

<iframe src="https://codesandbox.io/embed/userefelement-183yk?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useSelect"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
