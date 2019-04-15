import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useWorker from "@rooks/use-worker";
import README from "@rooks/use-worker/README.md";

function WorkerComponent() {
  const [value, setValue] = useState(0);
  const [error, setError] = useState(null);
  const worker = useWorker(
    "/worker.js",
    {},
    {
      onmessage: e => {
        console.log("message received from worker");
        console.log(e.data);
        setValue(e.data);
      },
      onerror: e => {
        setError(e);
      }
    }
  );
  return (
    <>
      <h1>Value is {value}</h1>
      <p>{error ? error.message : null}</p>
    </>
  );
}

storiesOf("useWorker", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <WorkerComponent />);
