---
id: useWindowSize
title: useWindowSize
sidebar_label: useWindowSize
---

   

## About

Window size hook for React.
<br/>

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import {useWindowSize} from "rooks
```

## Usage

```jsx
function WindowComponent() {
  const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize();

  return (
    <div>
      <p>
        <span>innerHeight - </span>
        <span>{innerHeight}</span>
      </p>
      <p>
        <span>innerWidth - </span>
        <span>{innerWidth}</span>
      </p>
      <p>
        <span>outerHeight - </span>
        <span>{outerHeight}</span>
      </p>
      <p>
        <span>outerWidth - </span>
        <span>{outerWidth}</span>
      </p>
    </div>
  );
}
render(<WindowComponent/>)
```

### Returned Object keys

| Returned object attributes | Type | Description            |
| -------------------------- | ---- | ---------------------- |
| width                      | int  | inner width of window  |
| height                     | int  | inner height of window |
| outerWidth                 | int  | outer height of window |
| outerHeight                | int  | outer width of window  |


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

