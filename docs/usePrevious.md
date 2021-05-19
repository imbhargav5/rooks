---
id: usePrevious
title: usePrevious
sidebar_label: usePrevious
---

## About

Access the previous value of a variable with this React hook
<br/>

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { usePrevious } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const myInput = useInput('hello world');
  const previousValue = usePrevious(myInput.value);
  return (
    <div>
      <div>
        <input {...myInput} />
      </div>
      <p>
        Current value is <b>{myInput.value}</b>
      </p>
      <p>
        Previous value was <b>{previousValue || '-'}</b>
      </p>
    </div>
  );
}

render(<Demo />);
```

## Arguments

| Argument | Type | Description                                        |
| -------- | ---- | -------------------------------------------------- |
| value    | any  | The variable whose previous value should be stored |

## Gif

[![Image from Gyazo](https://i.gyazo.com/9913f58e1959ed60fb590cb280639d88.gif)](https://gyazo.com/9913f58e1959ed60fb590cb280639d88)

## Codesandbox Example

## Basic Usage

<iframe src="https://codesandbox.io/embed/useprevious-uhjyr?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="usePrevious"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
