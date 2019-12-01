import React, { useRef } from "react";
import { storiesOf } from "@storybook/react";
import useCountdown from "@rooks/use-countdown";
import README from "@rooks/use-countdown/README.md";

function CountdownComponent() {
  const endTimeFor10seconds = useRef(new Date(Date.now() + 10000));
  // It could be a timestamp come from server
  const endTimeFor15minutes = useRef(new Date(Date.now() + 15 * 60 * 1000));

  const count = useCountdown(endTimeFor10seconds.current);

  const restTime = useCountdown(endTimeFor15minutes.current);
  const minutes = Math.floor(restTime / 60);
  const seconds = restTime % 60;

  return (
    <>
      <h3>Count down from 10 to 0:</h3>
      <p>Current value: {count}</p>
      <br />
      <p>Please scan the QR code and pay within {minutes} minutes and {seconds} seconds</p>
    </>
  );
}

storiesOf("useCountdown", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <CountdownComponent />);
