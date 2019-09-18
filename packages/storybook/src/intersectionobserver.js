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
  .add("Basic intersection observer example", () => (
    <IntersectionObserverApp />
  ));

const visibilityCondition = entry => {
  if (entry.intersectionRatio >= 0.5) {
    return true;
  }
  return false;
};
function IntersectionObserverApp() {
  const [
    elementRef,
    isVisible,
    intersectionObj,
    observerInState
  ] = useIntersectionObserver();
  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>See for the visibility of box at bottom of page</h1>
      <h2>Start scroling down to the visibility change!</h2>
      <div
        ref={elementRef}
        className="box"
        style={{
          position: "relative",
          top: "1200px",
          height: "200px",
          width: "200px",
          marginBottom: "20px",
          backgroundColor: "aqua"
        }}
      >
        {isVisible ? "Box is visible" : "Box is not visible"}
      </div>
      {isVisible ? "Box is visible" : "Box is not visible"}
    </div>
  );
}
