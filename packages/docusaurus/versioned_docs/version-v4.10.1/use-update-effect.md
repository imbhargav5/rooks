---
id: use-update-effect
title: use-update-effect
sidebar_label: use-update-effect
---

   

## About

An useEffect that does not run on first render

## Installation

    npm install --save @rooks/use-update-effect

## Importing the hook

```javascript
import useUpdateEffect from "@rooks/use-update-effect";
```

## Usage

```jsx
function Demo() {
  const [userID, setUserID] = useState();
  const [hasUpdated, setHasUpdated] = useState({ userID, updated: false });
  useUpdateEffect(() => {
    API.subscribe(userID);
    setHasUpdated({ userID, updated: true });
    () => {
      API.unsubscribe(userID);
      setHasUpdated({ userID, updated: false });
    };
  }, [value]);
  return (
    <>
      <button onClick={() => setUserID(Math.random())}>user ID is {userID}</button>
      <p>Has updated for userID - {hasUpdated.toString()}</p>
    </>
  );
}

render(<Demo />);
```


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    