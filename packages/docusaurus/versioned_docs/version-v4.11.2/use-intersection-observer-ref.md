---
id: use-intersection-observer-ref
title: use-intersection-observer-ref
sidebar_label: use-intersection-observer-ref
---

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

A hook to register an intersection observer listener
<br/>

## Installation

    npm install --save @rooks/use-intersection-observer-ref

## Importing the hook

```javascript
import useIntersectionObserverRef from '@rooks/use-intersection-observer-ref';
```

## Usage

```jsx
function Demo() {
  const [isVisible, setIsVisible] = useState(false);
  const callback = (entries) => {
    if (entries && entries[0]) {
      setIsVisible(entries[0].isIntersecting);
    }
  };
  const [myRef] = useIntersectionObserverRef(callback);
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
        }}
      >
        <h1>Is rectangle visible - {String(isVisible)}</h1>
      </div>
      <div style={{ height: 2000 }}></div>
      <div ref={myRef} style={{ height: 300, background: 'red' }}></div>
      <div style={{ height: 2000 }}></div>
    </>
  );
  return null;
}

render(<Demo />);
```

### Arguments

| Argument | Type                         | Description                                                                                                                  | Default Value                                                    |
| -------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| callback | IntersectionObserverCallback | Callback that will be fired when the intersection occurs                                                                     | undefined                                                        |
| options  | IntersectionObserverInit     | Intersection Observer config ([read more](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver#properties)) | `{ root: null,rootMargin: "0px 0px 0px 0px", threshold: [0, 1]}` |

### Return

Returns an array with the first element in the array being the callback ref for the React component/element that needs to be observed.

| Return value | Type        | Description                                                    | Default value |
| ------------ | ----------- | -------------------------------------------------------------- | ------------- |
| ref          | CallbackRef | ref for the React component/element that needs to be observed. | null          |


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    