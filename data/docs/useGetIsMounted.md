---
id: useGetIsMounted
title: useGetIsMounted
sidebar_label: useGetIsMounted
---

## About

Checks if a component is mounted or not at the time. Useful for async effects

[//]: # "Main"

## Examples

```jsx
function Demo() {
  const getIsMounted = useGetIsMounted();
  useEffect(() => {
    doSomethingAsync().then(() => {
      if(getIsMounted()){
        keepGoing();
      }
      return;
    })
  }, [...])
  return null
}

render(<Demo/>)
```

---

## Codesandbox Examples

### Basic Usage

Please consider submitting a codesandbox with usage as PR. Thanks!

---
