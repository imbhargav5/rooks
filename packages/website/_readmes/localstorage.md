# @rooks/use-localstorage

Sets and retrieves a key from localStorage and subscribes to it for updates across windows.

### Installation

```
npm install --save @rooks/use-localstorage
```

### Usage

```jsx
function Demo() {
  const { value, set, remove } = useLocalstorage("my-value", 0);
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

# Local Storage hook for React.
