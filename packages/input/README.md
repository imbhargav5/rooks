# @rooks/use-input

### Installation

```
npm install --save @rooks/use-input
```

### Usage

**Base**

```react
function Demo() {
  const myInput = useInput("hello");
  return (
    <div>
      <input {...myInput} />
      <p>
        Value is <b>{myInput.value}</b>
      </p>
    </div>
  );
}

render(<Demo/>)
```

**With optional validator**

```react
function Demo() {
  const myInput = useInput("hello", {
    validate: value => true
  });
  return (
    <div>
      <input {...myInput} />
      <p>
        Value is <b>{myInput.value}</b>
      </p>
    </div>
  );
}

render(<Demo/>)
```

Input hook for React
