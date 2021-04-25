---
id: use-intersection-observer-ref
title: use-intersection-observer-ref
sidebar_label: use-intersection-observer-ref
---

    

## About

A hook to register an intersection observer listener
<br/>

## Installation

    npm install --save @rooks/use-intersection-observer-ref

## Importing the hook

```javascript
import useIntersectionObserverRef from "@rooks/use-intersection-observer-ref"
```

## Usage

```jsx
function Demo() {
  const [isVisible, setIsVisible] = useState(false);
  const callback = entries => {
    if (entries && entries[0]) {
      setIsVisible(entries[0].isIntersecting);
    }
  };
  const [myRef] = useIntersectionObserverRef(callback);
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0
        }}
      >
        <h1>Is rectangle visible - {String(isVisible)}</h1>
      </div>
      <div style={{ height: 2000 }}></div>
      <div ref={myRef} style={{ height: 300, background: "red" }}></div>
      <div style={{ height: 2000 }}></div>
    </>
  );
  return null
}

render(<Demo/>)
```

### Arguments

| Argument | Type                         | Description                                       | Default Value                                                        |
| -------- | ---------------------------- | ------------------------------------------------- | -------------------------------------------------------------------- |
| callback | IntersectionObserverCallback | React ref whose boundingClientRect is to be found | undefined                                                            |
| options  | IntersectionObserverInit     | React ref whose boundingClientRect is to be found | `{ root: null,rootMargin: "0px 0px 0px 0px", threshold: [0, 1]}` |

### Return

Returns an array with the first element in the array being the callback ref for the React component/element that needs to be observed.

| Return value | Type        | Description                                                    | Default value |
| ------------ | ----------- | -------------------------------------------------------------- | ------------- |
| ref          | CallbackRef | ref for the React component/element that needs to be observed. | null          |


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    