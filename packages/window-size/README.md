# @react-hooks.org/use-window-size

### Installation

```
npm install --save @react-hooks.org/use-window-size
```

### Usage

```react
function WindowComponent() {
  const {
    height,
    width,
    outerHeight,
    innerHeight
  } = useWindowSize();


  return <div>
          <span>{height}</span>
          <span>{width}</span>
          <span>{outerHeight}</span>
          <span>{outerWidth}</span>
        </div>
}

render(<WindowComponent/>)
```

Counter hook for React
