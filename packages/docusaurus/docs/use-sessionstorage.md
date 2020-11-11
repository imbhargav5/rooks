---
id: use-sessionstorage
title: use-sessionstorage
sidebar_label: use-sessionstorage
---

## @rooks/use-sessionstorage

#### Session storage react hook. Easily manage session storage values.

<br/>

   



### Installation

    npm install --save @rooks/use-sessionstorage

### Importing the hook

```javascript
import useSessionstorage from "@rooks/use-sessionstorage";
```

### Usage

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

    