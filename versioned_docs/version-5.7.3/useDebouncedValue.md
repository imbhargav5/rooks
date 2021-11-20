---
id: useDebouncedValue
title: useDebouncedValue
sidebar_label: useDebouncedValue
---

## About

Tracks another value and gets updated in a debounced way.

[//]: # "Main"

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useDebouncedValue } from "rooks";
```

## Usage

```jsx
import React, { useState } from "react";
import { useDebouncedValue } from "rooks";

function Demo() {
  const [value, setValue] = useState("");
  const [debouncedFoo, immediatelyUpdateDebouncedValue] = useDebouncedValue(
    value,
    500
  );
  // use `immediatelyUpdateDebouncedValue` if you want to update `debouncedValue` immediately

  return (
    <div>
      <input
        onChange={(e) => setValue(e.target.value)}
        placeholder="Please type here"
      />
      <div>{debouncedFoo}</div>
    </div>
  );
}

render(<Demo />);
```

### Arguments

| Argument                   | Type    | Description                                                     | Default value |
|----------------------------|---------|-----------------------------------------------------------------|---------------|
| value                      | Date    | the value to be debounced                                       | undefined     |
| timeout                    | number  | milliseconds that it takes count down once                      | 1000          |
| options.initializeWithNull | boolean | Should the debouncedValue start off as null in the first render | false         |

### Return Value

An array is returned with the following items in it

| Name                            | Type         | Description                                                   |
|---------------------------------|--------------|---------------------------------------------------------------|
| debouncedValue                  | typeof value | The debouncedValue                                            |
| immediatelyUpdateDebouncedValue | function     | Handy utility function to update the debouncedValue instantly |

---

## Codesandbox Examples

### Basic Usage

<iframe
  src="https://codesandbox.io/embed/usedebouncedvalue-pgvg5?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="quizzical-glitter-emrtj"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

---

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
