---
id: useDebouncedValue
title: useDebouncedValue
sidebar_label: useDebouncedValue
---

## About

Tracks another value and gets updated in a debounced way.

[//]: # "Main"

## Examples

```jsx
import React, { useState } from "react";
import { useDebouncedValue } from "rooks";

export default function App() {
  const [value, setValue] = useState("");
  const [debouncedValue, immediatelyUpdateDebouncedValue] = useDebouncedValue(
    value,
    500
  );
  // use `immediatelyUpdateDebouncedValue` if you want to update `debouncedValue` immediately

  return (
    <div>
      <input
        onChange={e => setValue(e.target.value)}
        placeholder="Please type here"
      />
      <div>{debouncedValue}</div>
    </div>
  );
}
```

### Arguments

| Argument                   | Type    | Description                                                     | Default value |
| -------------------------- | ------- | --------------------------------------------------------------- | ------------- |
| value                      | Date    | the value to be debounced                                       | undefined     |
| timeout                    | number  | milliseconds that it takes count down once                      | 1000          |
| options.initializeWithNull | boolean | Should the debouncedValue start off as null in the first render | false         |

### Return Value

An array is returned with the following items in it

| Name                            | Type         | Description                                                   |
| ------------------------------- | ------------ | ------------------------------------------------------------- |
| debouncedValue                  | typeof value | The debouncedValue                                            |
| immediatelyUpdateDebouncedValue | function     | Handy utility function to update the debouncedValue instantly |
