# @rooks/use-document-event-listener

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/document-event-listener/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-document-event-listener/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-document-event-listener.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-document-event-listener.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fdocument-event-listener)



## About
A react hook to an event listener to the document object


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-document-event-listener
```

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
