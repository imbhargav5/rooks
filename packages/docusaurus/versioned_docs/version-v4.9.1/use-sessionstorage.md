---
id: use-sessionstorage
title: use-sessionstorage
sidebar_label: use-sessionstorage
---

   

## About

Session storage react hook. Easily manage session storage values.
<br/>

## Installation

    npm install --save @rooks/use-sessionstorage

## Importing the hook

```javascript
import useSessionstorage from "@rooks/use-sessionstorage";
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

    