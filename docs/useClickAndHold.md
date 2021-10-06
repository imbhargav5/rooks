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

| Argument         | Type     | Description                                                                           | Default value |
| ---------------- | -------- | ------------------------------------------------------------------------------------- | ------------- |
| onAction         | function | (isHolding: boolean) => {}, callback that will be called when user click or hold      | undefined     |
| options.delay    | number   | milliseconds between each onAction calls when the user is holding                     | 500           |
| options.disabled | boolean  | if true will stop onAction calls and detach handlers                                  | false         |

---

## Codesandbox Examples

### Basic Usage


---
## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
