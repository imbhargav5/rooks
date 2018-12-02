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

### Arguments

| Argument     | Type   | Description                 | Default value                 |
| ------------ | ------ | --------------------------- | ----------------------------- |
| initialValue | string | Initial value of the string | ""                            |
| opts         | object | Options                     | {syncWithInitialValue: false} |


### Options

| Option key           | Type    | Description                                                            | Default value |
| -------------------- | ------- | ---------------------------------------------------------------------- | ------------- |
| syncWithInitialValue | boolean | Should input update to the initialValue if the initialValue is updated | false         |


Input hook for React
