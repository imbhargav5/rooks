---
id: use-merge-refs
title: use-merge-refs
sidebar_label: use-merge-refs
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

Merges any number of refs into a single ref

[//]: # "Main"

## Installation

    npm install --save @rooks/use-merge-refs

## Importing the hook

```javascript
import useMergeRefs from "@rooks/use-merge-refs"
```

## Usage

```jsx
function Demo() {
  useMergeRefs();
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    