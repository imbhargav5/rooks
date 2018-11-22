# @rooks/use-visibility-sensor

### Installation

```
npm install --save @rooks/use-visibility-sensor
```

### Usage

```react

function Demo() {
    const rootNode = useRef(null);
    const { isVisible, visibilityRect } = useVisibilitySensor(rootNode, {
        intervalCheck: false,
        scrollCheck: true,
        resizeCheck: true
    });
    return (
        <div ref={rootNode}>
        <p>
            {isVisible ? "Visible" : isVisible === null ? "Null" : "Not Visible"}
        </p>
        </div>
    );
}

render(<Demo/>)
```

Visibility sensor hook for React
