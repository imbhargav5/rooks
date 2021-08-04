---
id: useLifecycleLogger
title: useLifecycleLogger
sidebar_label: useLifecycleLogger
---


## About
A react hook that console logs parameters as component transitions through lifecycles.


[//]: # (Main)

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import {useLifecycleLogger} from "rooks"
```

## Usage

```jsx
function Demo(props) {
  useLifecycleLogger('Demo',props);
  // it will log on mount, update and unmount
  return null
}

render(<Demo/>)
```

---

## Codesandbox Examples

### Basic Usage


---
## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
