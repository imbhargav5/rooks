---
id: use-timeout-when
title: use-timeout-when
sidebar_label: use-timeout-when
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

Takes a callback and fires it when a condition is true

[//]: # "Main"

## Installation

    npm install --save @rooks/use-timeout-when

## Importing the hook

```javascript
import useTimeoutWhen from "@rooks/use-timeout-when"
```

## Usage

```jsx
function Demo() {
  useTimeoutWhen(cb, 1000);
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    