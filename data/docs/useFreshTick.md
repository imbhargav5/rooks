---
id: useFreshTick
title: useFreshTick
sidebar_label: useFreshTick
---

## About

Like useFreshRef but specifically for functions

[//]: # "Main"

## Examples

```jsx
function Demo() {
  const [currentValue, setCurrentValue] = useState(0);
  function increment() {
    setCurrentValue(currentValue + 1);
  }
  // no stale closure issue
  const freshTick = useFreshTick(increment);
  useEffect(() => {
    const intervalId = setInterval(() => {
      freshTick();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return null;
}

render(<Demo />);
```

### Arguments

| Argument value | Type     | Description                                            |
| -------------- | -------- | ------------------------------------------------------ |
| callback       | function | The function call which needs to be fresh at all times |

### Returns

| Return value | Type     | Description                | Default value |
| ------------ | -------- | -------------------------- | ------------- |
| ref          | function | A function with fresh args | undefined     |

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/usefreshtick-vi4d5?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useFreshTick"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
