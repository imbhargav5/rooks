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
import useIntersectionObserver from "@rooks/use-intersectionobserver"
```

### Usage

```jsx
function IntersectionObserverApp() {

  /**
   * Optional arguments:
   **/

  /**
   * root: element with respect to which the visibility needs to be checked,
   * By default document is considered
   */

  /**
   * rootMargin: serves to grow or shrink each side of the root element's bounding box before computing intersections
   * Read more about this here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#The_root_element_and_root_margin
   */

  /**
   * threshold: indicates at what percentage of the target's visibility the observer's callback should be executed.
   *  Read more about it here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#The_root_element_and_root_margin
   */

  /**
   * when: By default true, when made false observer will stop observing the element
   */

  /**
   * callback: A function callback which  will get IntersectionObserverEntry[] and IntersectionObserver as the first and second arguments
   */

  /**
   * visibilityCondition: This function will get the entry object as the first and only argument, which can be
   * used to write custom logic which returns a boolean telling whether thos entry can be said as visible or not.
   */

  /**
   * For further information, read  https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
   */

  /**
   * Using the API requires only one mandatory option, ref to the element that need to observed.
   * In scenarios, like when we have list of items (<li>) in parent element <ul>, and user need to figure out
   * when the list item is visible in ul container, the user need to pass the rootRef attribute(ul element ref) as option
   * which will tell hook to observe the list item relative to ul container.
   */
  const option = {
    /* root: viewport, */
    /* rootMargin: "0px 0px 0px 0px", */
    /* threshold: [0, 0.5, 1], */
    /* when: true, */
    /* callback can also be passed
      callback: () => {
       console.log("threshold got hit");
     }, */
    /* visibilityCondition */
  };
  // const option = useOptionCreator(boxRef, documentRef);
  const [boxRef, isVisible, intersectionObj, observerInState] = useIntersectionObserver(option);
  return (
    <div className="App" style={
      { "display": "flex", "flexDirection": "column", "alignItems": "center" }
    }>
      <h1>See for the visibility of box at bottom of page</h1>
      <h2>Start scroling down to the visibility change!</h2>
      <div ref={boxRef} className="box" style={{ "position": "relative", "top": "1200px", "height": "200px", "width": "200px", "marginBottom": "20px", "backgroundColor": "aqua" }}>
        {isVisible ? "Box is visible" : "Box is not visible"}
      </div>
      {isVisible ? "Box is visible" : "Box is not visible"}
    </div>
  );
}

render(<IntersectionObserverApp />)
```
