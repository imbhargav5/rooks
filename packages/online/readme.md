# @rooks/use-online

### Installation

```
npm install --save @rooks/use-online
```

### Usage

```react
function Demo() {
  const isOnline = useOnline();
  return <p>Online status - {isOnline.toString()}</p>;
}

render(<Demo/>)
```

Online Status hook for React
