---
id: useCookieState
title: useCookieState
sidebar_label: useCookieState
---

## About

React hook that returns the current value of a cookie, a callback to update the cookie and a callback to delete the cookie.

[//]: # 'Main'

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useCookieState } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const [value, updateCookie] = useCookieState('my-cookie');

  return (
    <div>
      <input value={value} onChange={(e) => updateCookie(e.target.value)} />
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
