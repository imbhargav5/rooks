# @rooks/use-intersectionobserver

### A hook which tells you the amount of overlap a DOM element relative to another DOM element

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-intersectionobserver/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-intersectionobserver.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-intersectionobserver.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fintersectionobserver)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-intersectionobserver
```

### Importing the hook

```javascript
import useIntersectionObserver from "@rooks/use-intersectionobserver";
```

### Usage

```jsx
/***
 * To use the the intersection Observer
 * visibiltyCondition call back can sent , which will be having access to
 * intersection entry object
 * Read https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * about various attributes provided by entries
 * Each entry describes an intersection change for one observed
 *  target element:
 *  entry.boundingClientRect
 *  entry.intersectionRatio
 *  entry.intersectionRect
 *  entry.isIntersecting
 *  entry.rootBounds
 *  entry.target
 *  entry.time
 */
const visibilityCondition = (entry: IntersectionObserverEntry) => {
  if (entry.intersectionRatio >= 0.5) {
    return true;
  }
  return false;
};
function App() {
  const boxRef = React.useRef(null);
  const documentRef = React.useRef(null);
  const option = {
    elementRef: boxRef,
    rootRef: documentRef,
    rootMargin: "0px 0px 0px 0px",
    threshold: "0, 0.5, 1", // changed API to avoid passing array is passed by refernece
    when: true,
    //callback can also be passed
    // callback: () => {
    //   console.log("threshold got hit");
    // },
    visibilityCondition
  };
  // const option = useOptionCreator(boxRef, documentRef);
  const [isVisible, intersectionObj] = useIntersectionObserver(option);
  console.log("I will render intersectionObj", intersectionObj);
  return (
    <div className="App">
      <h1>Visibility of box at bottom of page</h1>
      <h2>Start scroling down change the visibility !</h2>
      <div ref={boxRef} className="box">
        {isVisible ? "Box is visible" : "Box is not visible"}
      </div>
      {isVisible ? "Box is visible" : "Box is not visible"}
    </div>
  );
}
```
