---
id: use-document-event-listener
title: use-document-event-listener
sidebar_label: use-document-event-listener
---


    

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

    