---
id: usePreviousImmediate
title: usePreviousImmediate
sidebar_label: usePreviousImmediate
---

## About

usePreviousImmediate returns the previous value of a variable even if it was the same or different

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { usePreviousImmediate } from "rooks";
```

## Usage

```jsx
function Demo() {
  const [value, setValue] = useState(0);
  const previousValue = usePreviousImmediate(value);
  return null;
}

render(<Demo />);
```

---

## Codesandbox Examples

### Basic Usage

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
