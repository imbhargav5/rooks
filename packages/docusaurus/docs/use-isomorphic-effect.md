---
id: use-isomorphic-effect
title: use-isomorphic-effect
sidebar_label: use-isomorphic-effect
---


    

## About

A hook that resolves to useEffect on the server and useLayoutEffect on the client.

[//]: # "Main"

## Installation

    npm install --save @rooks/use-isomorphic-effect

## Importing the hook

```javascript
import useIsomorphicEffect from "@rooks/use-isomorphic-effect"
```

## Usage

```jsx
function Demo() {
  useIsomorphicEffect( () => {
    console.log("Effect")
  } ,[]);
  return null
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    