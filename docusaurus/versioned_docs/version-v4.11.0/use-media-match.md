---
id: use-media-match
title: use-media-match
sidebar_label: use-media-match
---


    

## About

Signal whether or not a media query is currently matched.

[//]: # "Main"

## Installation

    npm install --save @rooks/use-media-match

## Importing the hook

```javascript
import useMediaMatch from '@rooks/use-media-match';
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

    