# @rooks/use-mouse

### Installation

```
npm install --save @rooks/use-mouse
```

### Usage

```jsx
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

### Returned Object 

| Returned object attributes | Type | Description         |
| -------------------------- | ---- | ------------------- |
| x                          | int  | X position of mouse |
| y                          | int  | Y position of mouse |

Mouse hook for React
