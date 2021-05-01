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
import {useWillUnmount} from "@rooks"
```

### Usage

```jsx

function Message(){

  useWillUnmount(function () {
    alert("unmounted")
  })
  return <p> Message </p>
}


function Demo() {
  const [
    value,
    changeValue
   ] = useState(true);

  function toggleValue(){
    changeValue(!value)
  }

  return <>
    <p><button onClick={toggleValue}>Toggle show </button></p>
    {value && <Message/>}
  </>;
}

render(<Demo/>)
```

#### Arguments

| Arguments | Type     | Description                                     | Default value |
| --------- | -------- | ----------------------------------------------- | ------------- |
| callback  | function | Callback function which needs to run on unmount | undefined     |

## A React hook for componentWillUnmount lifecycle method.


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

