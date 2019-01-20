# @rooks/use-sessionstorage

### Installation

```
npm install --save @rooks/use-sessionstorage
```

### Usage

```jsx
function Demo() {
  const { value, set, remove } = useSessionStorage("my-value", 0);
  return (
    <p>
      Value is {value}{" "}
      <button onClick={() => set(value !== null ? parseFloat(value) + 1 : 0)}>
        Increment
      </button>
      <button onClick={remove}>Remove </button>
    </p>
  );
}

render(<Demo />);
```

# Session storage react hook. Easily manage session storage values
