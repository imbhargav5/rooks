---
id: use-window-size
title: use-window-size
hide_title: true
sidebar_label: use-window-size
---

# @rooks/use-window-size

### Window size hook for React.

<br/>

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-window-size/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-window-size.svg) ![](https://img.shields.io/npm/dt/@rooks/use-window-size.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fwindow-size)



### Installation

    npm install --save @rooks/use-window-size

### Importing the hook

```javascript
import useWindowSize from "@rooks/use-window-size"
```

### Usage

```jsx
function WindowComponent() {
  const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize();

  return (
    <div>
      <p>
        <span>innerHeight - </span>
        <span>{innerHeight}</span>
      </p>
      <p>
        <span>innerWidth - </span>
        <span>{innerWidth}</span>
      </p>
      <p>
        <span>outerHeight - </span>
        <span>{outerHeight}</span>
      </p>
      <p>
        <span>outerWidth - </span>
        <span>{outerWidth}</span>
      </p>
    </div>
  );
}
render(<WindowComponent/>)
```

### Returned Object keys

| Returned object attributes | Type | Description            |
| -------------------------- | ---- | ---------------------- |
| width                      | int  | inner width of window  |
| height                     | int  | inner height of window |
| outerWidth                 | int  | outer height of window |
| outerHeight                | int  | outer width of window  |

    