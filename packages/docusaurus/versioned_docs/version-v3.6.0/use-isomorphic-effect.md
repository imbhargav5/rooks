---
id: use-isomorphic-effect
title: use-isomorphic-effect
hide_title: true
sidebar_label: use-isomorphic-effect
---

# @rooks/use-isomorphic-effect

### A hook that resolves to useEffect on the server and useLayoutEffect on the client.

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg) ![](https://img.shields.io/npm/v/@rooks/use-isomorphic-effect/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-isomorphic-effect.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-isomorphic-effect.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fisomorphic-effect)



### Installation

    npm install --save @rooks/use-isomorphic-effect

### Importing the hook

```javascript
import useIsomorphicEffect from "@rooks/use-isomorphic-effect"
```

### Usage

```jsx
function Demo() {
  useIsomorphicEffect( () => {
    console.log("Effect")
  } ,[]);
  return null
}

render(<Demo/>)
```

    