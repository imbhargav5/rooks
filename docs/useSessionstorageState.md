---
id: useSessionstorageState
title: useSessionstorageState
sidebar_label: useSessionstorageState
---

:::warning

`useSessionstorageState` is deprecated, it will be removed in rooks v7. Please use [useSessionstorage](/useSessionstorage) instead.

:::

## About

useState but syncs with sessionstorage

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useSessionstorageState } from "rooks";
```

## Usage

```jsx
function Demo() {
  useSessionstorageState();
  return null;
}

render(<Demo />);
```

---

## Codesandbox Examples

### Basic Usage

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
