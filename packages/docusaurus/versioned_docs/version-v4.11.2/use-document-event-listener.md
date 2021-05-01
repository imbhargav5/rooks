---
id: use-document-event-listener
title: use-document-event-listener
sidebar_label: use-document-event-listener
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

A react hook to an event listener to the document object

[//]: # "Main"

## Installation

    npm install --save @rooks/use-document-event-listener

## Importing the hook

```javascript
import useDocumentEventListener from "@rooks/use-document-event-listener"
```

## Usage

```jsx
function Demo() {
  useDocumentEventListener("click", function(){
    console.log("clicked")
  });
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    