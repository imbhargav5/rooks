---
id: useMediaMatch
title: useMediaMatch
sidebar_label: useMediaMatch
---

## About

Signal whether or not a media query is currently matched.

[//]: # "Main"

## Examples

```jsx
function Demo() {
  const isNarrowWidth = useMediaMatch("(max-width: 600px)");
  return <span>Your screen is {isNarrowWidth ? "narrow" : "wide"}</span>;
}

render(<Demo />);
```

### Arguments

| Argument value | Type   | Description                                                                                                              |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| query          | string | The media query to signal on. Example, `"print"` will signal `true` when previewing in print mode, and `false` otherwise |

### Returns

| Return value | Type    | Description                                         |
| ------------ | ------- | --------------------------------------------------- |
| isMatch      | Boolean | Whether or not the media query is currently matched |

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/usemediamatch-f616x?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useMediaMatch"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
