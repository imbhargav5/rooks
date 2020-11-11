---
id: use-did-update
title: use-did-update
sidebar_label: use-did-update
---

   

## About

componentDidUpdate hook for react

## Installation

    npm install --save @rooks/use-did-update

## Importing the hook

```javascript
import useDidUpdate from "@rooks/use-did-update";
```

## Usage

```jsx
function Demo() {
  const [value, setValue] = useState(0);
  const [hasUpdated, setHasUpdated] = useState(false);
  useDidUpdate(() => {
    console.log("Update");
    setHasUpdated(true);
  }, [value]);
  return (
    <>
      <button onClick={() => setValue(value + 1)}>Value is {value}</button>
      <p>Has updated - {hasUpdated.toString()}</p>
      <p>Please check the console for logs.</p>
    </>
  );
}

render(<Demo />);
```


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    