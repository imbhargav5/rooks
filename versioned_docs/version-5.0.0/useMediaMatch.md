---
id: useMediaMatch
title: useMediaMatch
sidebar_label: useMediaMatch
---


    

## About

Signal whether or not a media query is currently matched.

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import {useMediaMatch} from 'rooks';
```

## Usage

```jsx
function Demo() {
  const isNarrowWidth = useMediaMatch('(max-width: 600px)');
  return <span>Your screen is {isNarrowWidth ? 'narrow' : 'wide'}.</span>;
}

render(<Demo />);
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

