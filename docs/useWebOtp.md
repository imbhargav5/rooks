---
id: useWebOtp
title: useWebOtp
sidebar_label: useWebOtp
---


## About
Verify phone numbers on the web with the [WebOTP API](https://web.dev/web-otp/)


[//]: # (Main)

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import {useWebOtp} from "rooks"
```

## Usage

```jsx
function Demo() {
    const [when, setWhen] = useState(false);
  const {code, type, error, isSupported,abort} = useWebOtp({
      when
  });
  
  function onSubmit() {
      // Cancel the WebOtp listener
      abort();
  }
  
  return null
}

render(<Demo/>)
```

---

## Codesandbox Examples

### Basic Usage


---
## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
