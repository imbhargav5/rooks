---
id: usePreviousDifferent
title: usePreviousDifferent
sidebar_label: usePreviousDifferent
---


    

## About

usePreviousDifferent returns the last different value of a variable

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import {usePreviousDifferent} from "rooks"
```

## Usage

```jsx
function Demo() {
  const [value, setValue] = useState(0)
  const previousValue = usePreviousDifferent(value) 
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

