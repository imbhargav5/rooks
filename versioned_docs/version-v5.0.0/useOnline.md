---
id: useOnline
title: useOnline
sidebar_label: useOnline
---

   

## About

Online status hook for React.

### Installation

    npm install --save rooks

### Importing the hook

```javascript
import {useOnline} from "rooks";
```

### Usage

```jsx
function Demo() {
  const isOnline = useOnline();
  return <p>Online status - {isOnline.toString()}</p>;
}

render(<Demo />);
```

### Return value

Offline status (boolean) is returned.


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

