---
id: usePreviousImmediate
title: usePreviousImmediate
sidebar_label: usePreviousImmediate
---

## About

usePreviousImmediate returns the previous value of a variable even if it was the same or different

[//]: # "Main"

## Examples

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
