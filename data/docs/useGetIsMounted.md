---
id: useGetIsMounted
title: useGetIsMounted
sidebar_label: useGetIsMounted
---

## About

Checks if a component is mounted or not at the time. Useful for async effects

[//]: # "Main"

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useGetIsMounted } from "rooks";
```

## Usage

```jsx
function Demo() {
  const getIsMounted = useGetIsMounted();
  useEffect(() => {
    doSomethingAsync().then(() => {
      if(getIsMounted()){
        keepGoing();
      }
      return;
    })
  }, [...])
  return null
}

render(<Demo/>)
```

---

## Codesandbox Examples

### Basic Usage

Please consider submitting a codesandbox with usage as PR. Thanks!

---

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
