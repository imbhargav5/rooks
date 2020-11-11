---
id: use-previous
title: use-previous
hide_title: true
sidebar_label: use-previous
---

# @rooks/use-previous

### Access the previous value of a variable with this React hook

<br/>

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-previous/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-previous.svg) ![](https://img.shields.io/npm/dt/@rooks/use-previous.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fprevious)



### Installation

    npm install --save @rooks/use-previous

### Importing the hook

```javascript
import usePrevious from "@rooks/use-previous";
```

### Usage

```jsx
function Demo() {
  const myInput = useInput("hello world");
  const previousValue = usePrevious(myInput.value);
  return (
    <div>
      <div>
        <input {...myInput} />
      </div>
      <p>
        Current value is <b>{myInput.value}</b>
      </p>
      <p>
        Previous value was <b>{previousValue || "-"}</b>
      </p>
    </div>
  );
}

render(<Demo />);
```

## Arguments

| Argument | Type | Description                                        |
| -------- | ---- | -------------------------------------------------- |
| value    | any  | The variable whose previous value should be stored |

## Gif

[![Image from Gyazo](https://i.gyazo.com/9913f58e1959ed60fb590cb280639d88.gif)](https://gyazo.com/9913f58e1959ed60fb590cb280639d88)

    