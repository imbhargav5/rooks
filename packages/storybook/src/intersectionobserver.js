import React from "react";
import { storiesOf } from "@storybook/react";
import useIntersectionObserver from "@rooks/use-intersectionobserver";
import README from "@rooks/use-intersectionobserver/README.md";

storiesOf("useIntersectionObserver", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("Basic example", () => <Basic />)
// .add("multiple events on keys", () => <MultipleEvents />)
// .add("toggling listeners using `when` ", () => (
//   <TogglingListenersWithBoolean />
// ));

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
const visibilityCondition = (entry) => {
  if (entry.intersectionRatio >= 0.5) {
    return true;
  }
  return false;
};
function Basic() {
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