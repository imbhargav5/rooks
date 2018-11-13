# @react-hooks.org/use-timeout

### Installation

```
npm install --save @react-hooks.org/use-timeout
```

### Usage

```react
function TimeoutComponent() {
  function doAlert() {
    window.alert("timeout expired!");
  }
  const { start, clear } = useTimeout(doAlert, 2000);
  return (
    <>
      <button onClick={start}> Start timeout </button>
      <button onClick={clear}> Clear timeout </button>
    </>
  );
}

render(<TimeoutComponent/>)
```

Counter hook for React
