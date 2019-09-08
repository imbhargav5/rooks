# @rooks/use-throttle

### Throttle custom hook for React

### Installation

```
npm install --save @rooks/use-throttle
```

### Importing the hook

```javascript
import useThrottle from "@rooks/use-throttle"
```

### Usage

```jss
function ThrottleDemo() {
  const [number, setNumber] = useState(0);
  const addNumber = () => setNumber(number + 1);
  const [addNumberThrottled] = useThrottle(addNumber, 1000);
  return (
    <>
      <h1>Number: {number}</h1>
      <p>Click really fast.</p>
      <button onClick={addNumber}>Add number</button>
      <button onClick={addNumberThrottled}>Add number throttled</button>
    </>
  );
}
```


### Arguments

| Argument            | Type     | Description                         | Default value |
| ------------------- | -------- | ----------------------------------- | ------------- |
| callback (required) | function | Function that needs to be throttle  | undefined     |
| timeout (optional)  | number   | Time to throttle the callback in ms | 300           |

