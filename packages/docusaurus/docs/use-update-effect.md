---
id: use-update-effect
title: use-update-effect
sidebar_label: use-update-effect
---


   

## About

componentDidUpdate hook with cleanup function support for react

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


---

## Codesandbox Examples

### Basic Usage

this needs to be created

<!-- <iframe src="https://codesandbox.io/embed/use-did-mount-tdxl3?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark"
     style={{
        width: "100%",
        height: 500,
        border: 0,
        borderRadius: 4,
        overflow: "hidden"
    }}
    title="use-did-update"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/> -->
    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    