---
id: useWillUnmount
title: useWillUnmount
sidebar_label: useWillUnmount
---

### About

componentWillUnmount lifecycle as hook for React.

### Installation

    npm install --save rooks

### Importing the hook

```javascript
import { useWillUnmount } from '@rooks';
```

### Usage

```jsx
function Message() {
  useWillUnmount(function () {
    alert('unmounted');
  });
  return <p> Message </p>;
}

function Demo() {
  const [value, changeValue] = useState(true);

  function toggleValue() {
    changeValue(!value);
  }

  return (
    <>
      <p>
        <button onClick={toggleValue}>Toggle show </button>
      </p>
      {value && <Message />}
    </>
  );
}

render(<Demo />);
```

#### Arguments

| Arguments | Type     | Description                                     | Default value |
| --------- | -------- | ----------------------------------------------- | ------------- |
| callback  | function | Callback function which needs to run on unmount | undefined     |

## A React hook for componentWillUnmount lifecycle method.

## Codesandbox Example

### Basic usage

<iframe src="https://codesandbox.io/embed/usewillunmount-ogk90?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useWillUnmount"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
