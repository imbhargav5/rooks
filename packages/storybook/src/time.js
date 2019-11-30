import React, { useState, useCallback } from "react";
import { storiesOf } from "@storybook/react";
import useTime from "@rooks/use-time";
import useToggle from "@rooks/use-toggle";
import README from "@rooks/use-time/README.md";

storiesOf("useTime", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("basic example", () => <UseTimeDemo />);

function UseTimeDemo() {
  const [count, setCount] = useState(0);
  const [paused, togglePaused] = useToggle(false);
  const increment = useCallback(() => setCount(value => value + 1), [setCount]);
  const time = useTime({ onTick: increment });
  const timeEveryTwoSeconds = useTime({ interval: paused ? 0 : 2000 });

  return (
    <>
      <h3>1. default interval</h3>
      <p>time: {time.toISOString()}</p>
      <p>tick times: {count}</p>
      <h3>2. two seconds interval</h3>
      <p>time{paused && '(paused)'}: {timeEveryTwoSeconds.toISOString()}</p>
      <button onClick={togglePaused}>stop/start</button>
    </>
  );
}
