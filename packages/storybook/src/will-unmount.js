import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useWillUnmount from "@rooks/use-will-unmount";

storiesOf("useUnmount", module).add("basic example", () => (
  <UnmountComponent />
));

function Message() {
  useWillUnmount(function() {
    alert("Message will be unmounted now.");
  });
  return <p> Message </p>;
}

function UnmountComponent() {
  const [value, changeValue] = useState(true);

  function toggleValue() {
    changeValue(!value);
  }

  return (
    <>
      <p>
        <button onClick={toggleValue}>Toggle </button>
      </p>
      {value && <Message />}
    </>
  );
}
