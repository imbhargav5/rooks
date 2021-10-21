---
id: useConsole
title: useConsole
sidebar_label: useConsole
---

## About

Drop in replacement for javascript console but it is reactive.

Using console.log inside render function or inside react components
can lead to your JS console being very crowded with repeated logs on
every render even though the value you were logging did not change.

Usually, workaround is something like this:

```jsx
const [value, setValue] = useState(0);

useEffect(() => {
    console.log(value) // now the console will log only when the value changes
}, [value])
```

useConsole does that for you. Also it has few neat tricks so you can keep your
JS console nice and tidy and lose less time while debugging.

[//]: # "Main"

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useConsole } from "rooks";
```

## Usage

```jsx
const Demo = () => {
  const [value, setValue] = useState(0);

  // this will log to console only when the value changes
  useConsole(value);

  return (
    <div>
      <span>Current value: {value}</span>
      <button onClick={() => setValue(value + 1)}>Increment</button>
    </div>
  );
};

render(<Demo />);
```

You can also provide any of the valid Console log levels as first argument and this will switch underlying console method to that one.

```jsx
const Demo2 = () => {
  const [value, setValue] = useState(0);


  useConsole("info", value);

  return (
    <div>
      <span>Current value: {value}</span>
      <button onClick={() => setValue(value + 1)}>Increment</button>
    </div>
  );
};

render(<Demo2 />);
```

## Arguments

| Arguments    | Type    | Description                    | Default value  |
| ------------ | ------- | ------------------------------ | -------------- |
| levelMaybe   | unknown | If this is one of the Console log levels then it will change the underlying console method. | 'log'          |
| args      | unknown[]  | An options object for the hook | [] |

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/s/useconsole-6h9ss?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useConsole"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
---
## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
