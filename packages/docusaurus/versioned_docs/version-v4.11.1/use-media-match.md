---
id: use-media-match
title: use-media-match
sidebar_label: use-media-match
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

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

    