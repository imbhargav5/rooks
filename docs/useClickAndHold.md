---
id: useClickAndHold
title: useClickAndHold
sidebar_label: useClickAndHold
---

## About
Dispatch function when user click or click and hold some HTML element


[//]: # (Main)

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import {useClickAndHold} from "rooks"
```

## Usage

```jsx
function Demo() {
  function action(isHolding) {
    console.log('Is holding: ', isHolding);
  }

  const handlers = useClickAndHold(action);

  return <button {...handlers}>Button</button>
}

render(<Demo/>)
```

### Arguments

| Argument             | Type     | Description                                                                           | Default value |
| ----------------     | -------- | ------------------------------------------------------------------------------------- | ------------- |
| onAction             | function | (isHolding: boolean) => {}, callback that will be called when user click or hold      | undefined     
| options.initialDelay | number   | milliseconds before calls onAction callback                                           | 500           
| options.delay        | number   | milliseconds between each onAction calls when the user is holding                     | 500           
| options.disabled     | boolean  | if true will stop onAction calls and detach handlers                                  | false         |

---

## Codesandbox Examples

<iframe 
  src="https://codesandbox.io/embed/useclickandhold-example-forked-juw7i?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="useClickAndHold-example"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
>
</iframe>

### Basic Usage


---
## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
