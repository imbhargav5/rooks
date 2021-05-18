---
id: useUpdateEffect
title: useUpdateEffect
sidebar_label: useUpdateEffect
---

## About

An useEffect that does not run on first render

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useUpdateEffect } from 'rooks';
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
      <button onClick={() => setUserID(Math.random())}>
        user ID is {userID}
      </button>
      <p>Has updated for userID - {hasUpdated.toString()}</p>
    </>
  );
}

render(<Demo />);
```

## Codesandbox Example

### Basic Usage

<iframe src="https://codesandbox.io/embed/useupdateeffect-zyopx?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useUpdateEffect"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
