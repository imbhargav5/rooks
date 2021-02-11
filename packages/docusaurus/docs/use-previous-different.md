---
id: use-previous-different
title: use-previous-different
sidebar_label: use-previous-different
---


    

## About

usePreviousDifferent returns the last different value of a variable

[//]: # "Main"

## Installation

    npm install --save @rooks/use-previous-different

## Importing the hook

```javascript
import usePreviousDifferent from "@rooks/use-previous-different"
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

    