---
id: use-previous-immediate
title: use-previous-immediate
sidebar_label: use-previous-immediate
---


    

## About

usePreviousImmediate returns the previous value of a variable even if it was the same or different

[//]: # "Main"

## Installation

    npm install --save @rooks/use-previous-immediate

## Importing the hook

```javascript
import usePreviousImmediate from "@rooks/use-previous-immediate"
```

## Usage

```jsx
function Demo() {
  const [value, setValue] = useState(0)
  const previousValue = usePreviousImmediate(value) 
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    