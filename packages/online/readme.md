# @rooks/use-online

### Installation

```
npm install --save @rooks/use-online
```

### Usage

```jsx
function Demo() {
  const isOnline = useOnline();
  return <p>Online status - {isOnline.toString()}</p>;
}

render(<Demo/>)
```

### Return value

Offline status (boolean) is returned.

Online Status hook for React
