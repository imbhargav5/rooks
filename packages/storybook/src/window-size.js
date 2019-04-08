import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useWindowSize from "@rooks/use-window-size";

storiesOf("useWindowSize", module).add("basic example", () => (
  <WindowComponent />
));

function WindowComponent() {
  const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize();

  return (
    <>
      <h1> Window dimensions</h1>
      <h3>Resize window to see changes</h3>
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
    </>
  );
}
