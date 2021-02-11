# @rooks/use-fresh-ref

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/fresh-ref/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-fresh-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-fresh-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-fresh-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ffresh)



## About
Avoid stale state in callbacks with this hook. Auto updates values using a ref.


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-fresh-ref
```

## Importing the hook

```javascript
import useFreshRef from "@rooks/use-fresh-ref"
```

## Usage

```jsx
function Demo() {
  const [value, setValue] = useState(5)
  function increment(){
    setValue(value + 1)
  }
  const freshIncrementRef = useFreshRef(increment);
  
  useEffect(() => {
    function tick(){
      freshIncrementRef.current();
    }
    const intervalId = setInterval(tick,1000)
    return clearInterval(intervalId)
  }, [])

  return null
}

render(<Demo/>)
```
