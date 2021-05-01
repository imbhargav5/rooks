---
id: useFreshTick
title: useFreshTick
sidebar_label: useFreshTick
---


    

## About

Like useFreshRef but specifically for functions

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import {useFreshTick} from "rooks";
```

## Usage

```jsx
function Demo() {
  const [currentValue, setCurrentValue] = useState(0);
  function increment() {
    setCurrentValue(currentValue + 1);
  }
  // no stale closure issue
  const freshTick = useFreshTick(increment);
  useEffect(() => {
    const intervalId = setInterval(() => {
      freshTick();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return null;
}

render(<Demo />);
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

