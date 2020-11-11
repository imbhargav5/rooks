---
id: use-isomorphic-effect
title: use-isomorphic-effect
sidebar_label: use-isomorphic-effect
---

## @rooks/use-isomorphic-effect

#### A hook that resolves to useEffect on the server and useLayoutEffect on the client.

    



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

    