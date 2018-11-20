# @react-hooks.org/use-mouse

### Installation

```
npm install --save @react-hooks.org/use-mouse
```

### Usage

```react
function Demo() {
  const { x, y } = useMouse();
  return (
    <>
      <p> Move mouse here to see changes to position </p>
      <p>X position is {x || "null"}</p>
      <p>X position is {y || "null"}</p>
    </>
  );
}

render(<Demo/>)
```

Mouse hook for React
