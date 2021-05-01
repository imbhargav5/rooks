# @rooks/use-previous

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/previous/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-previous/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-previous.svg) ![](https://img.shields.io/npm/dt/@rooks/use-previous.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fprevious)




## About 
Access the previous value of a variable with this React hook
<br/>

## Installation

```
npm install --save @rooks/use-previous
```

## Importing the hook

```javascript
import usePrevious from "@rooks/use-previous";
```

## Usage

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
