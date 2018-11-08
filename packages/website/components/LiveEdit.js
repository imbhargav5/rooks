import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { useState } from "react";

function useCounter(initialValue) {
  const [counter, setCounter] = useState(initialValue);

  function incrementBy(incrAmount) {
    setCounter(counter + incrAmount);
  }
  function decrementBy(decrAmount) {
    incrementBy(-decrAmount);
  }
  function increment() {
    setCounter(counter + 1);
  }
  function decrement() {
    incrementBy(-1);
  }
  function reset() {
    setCounter(initialValue);
  }
  return {
    value: counter,
    increment,
    decrement,
    incrementBy,
    decrementBy,
    reset
  };
}

const LiveEdit = ({ noInline, code, scope = {} }) => {
  return (
    <LiveProvider
      code={code}
      noInline={noInline}
      scope={{
        ...scope,
        useCounter
      }}
    >
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
};

export default LiveEdit;
