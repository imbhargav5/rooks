---
id: use-localstorage-state
title: use-localstorage-state
sidebar_label: use-localstorage-state
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

UseState but auto updates values to localStorage

[//]: # "Main"

## Installation

    npm install --save @rooks/use-localstorage-state

## Importing the hook

```javascript
import useLocalstorageState from "@rooks/use-localstorage-state"
```

## Usage

```jsx
function Demo() {
  useLocalstorageState();
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    