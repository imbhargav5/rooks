---
id: useDebouncedValue
title: useDebouncedValue
sidebar_label: useDebouncedValue
---


## About
Tracks another value and gets updated in a debounced way.


[//]: # (Main)

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import {useDebouncedValue} from "rooks"
```

## Usage

```jsx
function Demo() {
  const [value, setValue] = useState("");
  const debouncedValue useDebouncedValue(value,1000);
  return <div>
      <p>Value is {value}</p>
      <p>Debounced value is {debouncedValue}</p>
      <button onClick={() => setValue(value + 1)}>Increment </button>
  </div>
}

render(<Demo/>)
```

---

## Codesandbox Examples

### Basic Usage


---
## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
