---
id: useFreshRef
title: useFreshRef
sidebar_label: useFreshRef
---

## About

Avoid stale state in callbacks with this hook. Auto updates values using a ref.

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useFreshRef } from "rooks";
```

## Usage

```jsx
function Demo() {
  const [value, setValue] = useState(5);
  function increment() {
    setValue(value + 1);
  }
  const freshIncrementRef = useFreshRef(increment);

  useEffect(() => {
    function tick() {
      freshIncrementRef.current();
    }
    const intervalId = setInterval(tick, 1000);
    return () => { 
      clearInterval(intervalId); 
    }
  }, []);

  return null;
}

render(<Demo />);
```

### Arguments

| Argument value     | Type    | Description                                                                               |
|--------------------|---------|-------------------------------------------------------------------------------------------|
| value              | T       | The value which needs to be fresh at all times. Probably best used with functions         |
| preferLayoutEffect | boolean | Should the value be updated using a layout effect or a passive effect. Defaults to false. |

### Returns

| Return value | Type      | Description                      | Default value |
|--------------|-----------|----------------------------------|---------------|
| ref          | RefObject | A ref containing the fresh value | () => null    |

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/usefreshref-2e8tx?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useFreshRef"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
