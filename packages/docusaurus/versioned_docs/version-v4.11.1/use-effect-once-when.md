---
id: use-effect-once-when
title: use-effect-once-when
sidebar_label: use-effect-once-when
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

Runs a callback effect atmost one time when a condition becomes true

[//]: # "Main"

## Installation

    npm install --save @rooks/use-effect-once-when

## Importing the hook

```javascript
import useEffectOnceWhen from "@rooks/use-effect-once-when"
```

## Usage

```jsx
function Demo() {
  const hasOpenedPage = true
  useEffectOnceWhen(() => {
    console.log("user has opened page")
  },hasOpenedPage);
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    