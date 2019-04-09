import React from "react";
import useWindowSize from "../src";

function WindowComponent() {
  const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize();

  return (
    <div>
      <p>
        <span>innerHeight - </span>
        <span data-testid="innerHeight">{innerHeight}</span>
      </p>
      <p>
        <span>innerWidth - </span>
        <span data-testid="innerWidth">{innerWidth}</span>
      </p>
      <p>
        <span>outerHeight - </span>
        <span data-testid="outerHeight">{outerHeight}</span>
      </p>
      <p>
        <span>outerWidth - </span>
        <span data-testid="outerWidth">{outerWidth}</span>
      </p>
    </div>
  );
}

export default WindowComponent
//ReactDOM.render(<WindowComponent />, document.getElementById("app"));
