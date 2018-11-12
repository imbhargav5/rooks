import React from "react";
import ReactDOM from "react-dom";
import useWindowSize from "../src";

function WindowComponent() {
  const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize();

  return (
    <div>
      <p>
        <span>innerHeight - </span>
        <span>{innerHeight}</span>
      </p>
      <p>
        <span>innerWidth - </span>
        <span>{innerWidth}</span>
      </p>
      <p>
        <span>outerHeight - </span>
        <span>{outerHeight}</span>
      </p>
      <p>
        <span>outerWidth - </span>
        <span>{outerWidth}</span>
      </p>
    </div>
  );
}

ReactDOM.render(<WindowComponent />, document.getElementById("app"));
