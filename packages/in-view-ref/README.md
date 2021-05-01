# @rooks/use-in-view-ref


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](/packages/in-view-ref/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-in-view-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-in-view-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-in-view-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fin-view-ref)

## About

Simple hook that monitors element enters or leave the viewport that's using Intersection Observer API. It returns a ref to observed element, as well as boolean flag - `inView` that will tell if the element is inside of the viewport / parent element or not. You can also pass a callback that will be fired everytime the Observer will be triggered. To understand the Intersection Observer API better, please check its [documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

[//]: # 'Main'

## Installation

```
npm install --save @rooks/use-in-view-ref
```

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
