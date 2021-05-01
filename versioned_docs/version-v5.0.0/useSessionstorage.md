---
id: useSessionstorage
title: useSessionstorage
sidebar_label: useSessionstorage
---

   

## About

Session storage react hook. Easily manage session storage values.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import {useSessionstorage} from "rooks";
```

## Usage

```jsx
function Demo() {
  const [value, set, remove] = useSessionstorage("my-value", 0);
  // Can also be used as {value, set, remove}

  return (
    <p>
      Value is {value}{" "}
      <button onClick={() => set(value !== null ? parseFloat(value) + 1 : 0)}>
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

