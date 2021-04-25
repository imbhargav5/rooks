# @rooks/use-fresh-tick

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/fresh-tick/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-fresh-tick/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-fresh-tick.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-fresh-tick.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ffresh-tick)

## About

Like use-fresh-ref but specifically for functions

[//]: # "Main"

## Installation

```
npm install --save @rooks/use-fresh-tick
```

## Importing the hook

```javascript
import useFreshTick from "@rooks/use-fresh-tick";
```

## Usage

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
