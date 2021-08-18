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

### Arguments

| Argument         | Type     | Description                                                         | Default value |
| ---------------- | -------- | ------------------------------------------------------------------- | ------------- |
| value            | Date     | the value to be debounced                                           | undefined     |
| timeout          | number   | milliseconds that it takes count down once                          | 1000          |
| options.initializeWithNull | boolean |  Should the debouncedValue start off as null in the first render        | false     |


### Return Value

An array is returned with the following items in it

| Type   | | Type     Description                                                    |
| ------ | -------------------------------------------------------------- |
| debouncedValue | typeof value     | The debouncedValue |
| immediatelyUpdateDebouncedValue| function | Handy utility function to update the debouncedValue instantly  | 

---

## Codesandbox Examples

### Basic Usage


---
## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
