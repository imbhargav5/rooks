---
id: use-in-view-ref
title: use-in-view-ref
sidebar_label: use-in-view-ref
---


    

## About

Simple hook that monitors element enters or leave the viewport that's using Intersection Observer API. It returns a ref to observed element, as well as boolean flag - `inView` that will tell if the element is inside of the viewport / parent element or not. You can also pass a callback that will be fired everytime the Observer will be triggered. To understand the Intersection Observer API better, please check its [documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

[//]: # "Main"

## Installation

    npm install --save @rooks/use-in-view-ref

## Importing the hook

```javascript
import useInViewRef from '@rooks/use-in-view-ref';
```

## Usage

```jsx
function Demo() {
  const [myRef, inView] = useInViewRef();

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
        }}
      >
        <h1>Is rectangle visible - {String(inView)}</h1>
      </div>
      <div style={{ height: 2000 }}></div>
      <div ref={myRef} style={{ height: 300, background: 'red' }}></div>
      <div style={{ height: 2000 }}></div>
    </>
  );
}

render(<Demo />);
```

### Arguments

| Argument | Type                         | Description                                                                                                                  | Default Value                                                    | Required |
| -------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| callback | IntersectionObserverCallback | Callback that will be fired when the intersection occurs                                                                     | undefined                                                        | no       |
| options  | IntersectionObserverInit     | Intersection Observer config ([read more](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver#properties)) | `{ root: null,rootMargin: "0px 0px 0px 0px", threshold: [0, 1]}` | no       |

### Return

Returns an array with the first element in the array being the callback ref for the React component/element that needs to be observed and a second being the boolean flag that indicates if the element is in viewport.

| Return value | Type        | Description                                                    | Default value |
| ------------ | ----------- | -------------------------------------------------------------- | ------------- |
| ref          | CallbackRef | ref for the React component/element that needs to be observed. | null          |
| inView       | boolean     | flag that will indicate if the element is in viewport          | false         |


---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/s/use-in-view-ref-juc75?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark"
     style={{
        width: "100%",
        height: 500,
        border: 0,
        borderRadius: 4,
        overflow: "hidden"
    }}
     title="use-counter"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    