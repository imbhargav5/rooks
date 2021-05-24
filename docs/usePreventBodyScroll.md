---
id: usePreventBodyScroll
title: usePreventBodyScroll
sidebar_label: usePreventBodyScroll
---

## About

A react hook to prevent body scroll. Optionally takes a condition when which disables body scroll only when the condition is true.

[//]: # 'Main'

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { usePreventBodyScroll } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const [scroll, toggleScroll] = useState(false);
  usePreventBodyScroll({ when: scroll });
  return (
    <div>
      <button onClick={() => toggleScroll((prev) => !prev)}>
        Toggle Scroll
      </button>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
    </div>
  );
}

render(<Demo />);
```

---

## Codesandbox Examples

### Basic Usage

---

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
