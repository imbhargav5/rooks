---
id: use-did-update
title: use-did-update
sidebar_label: use-did-update
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

   

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


---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/use-did-mount-tdxl3?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark"
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
/>
    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    