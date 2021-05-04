---
id: useLocalstorage
title: useLocalstorage
sidebar_label: useLocalstorage
---

   

## About

Localstorage hook for React. Syncs with localstorage values across components and browser windows automatically. Sets and retrieves a key from localStorage and subscribes to it for updates across windows.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import {useLocalstorage} from "rooks";
```

## Usage

```jsx
function Demo() {
  const [value, set, remove] = useLocalstorage("my-value", 0);
  // Can also be used as {value, set, remove}

  return (
    <p>
      Value is {value}
      <button onClick={() => set(value !== null ? value + 1 : 0)}>
        Increment
      </button>
      <button onClick={remove}>Remove </button>
    </p>
  );
}

render(<Demo />);
```


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

