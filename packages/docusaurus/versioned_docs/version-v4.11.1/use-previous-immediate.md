---
id: use-previous-immediate
title: use-previous-immediate
sidebar_label: use-previous-immediate
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

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

    