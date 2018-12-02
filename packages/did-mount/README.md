# @rooks/use-did-mount

### Installation

```
npm install --save @rooks/use-did-mount
```

### Usage

```react
function Demo() {
  useDidMount(function(){
    console.log("mounted")
  });
  return null
}

render(<Demo/>)
```

### Arguments

| Argument | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| callback | function | function to be called on mount |

# A React hooks package for componentDidMount
