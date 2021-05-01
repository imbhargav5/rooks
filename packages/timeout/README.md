# @rooks/use-timeout

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/timeout/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-timeout/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-timeout.svg) ![](https://img.shields.io/npm/dt/@rooks/use-timeout.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Ftimeout)




## About 
setTimeout hook for react.
<br/>

## Installation

```
npm install --save @rooks/use-timeout
```

## Importing the hook

```javascript
import useTimeout from "@rooks/use-timeout"
```


## Usage

```jsx
function TimeoutComponent() {
  function doAlert() {
    window.alert("timeout expired!");
  }
  const { start, clear } = useTimeout(doAlert, 2000);
  return (
    <>
      <button onClick={start}> Start timeout </button>
      <button onClick={clear}> Clear timeout </button>
    </>
  );
}

render(<TimeoutComponent/>)
```

### Arguments

| Arguments | Type     | Description                                              | Default value |
| --------- | -------- | -------------------------------------------------------- | ------------- |
| callback  | function | Function to be executed in timeout                       | undefind      |
| delay     | Number   | Number in milliseconds after which callback is to be run | 0             |

### Returned Object keys

| Returned object attributes | Type     | Description           |
| -------------------------- | -------- | --------------------- |
| clear                      | function | Clear the timeout     |
| start                      | function | Start the timeout     |
| isActive                   | boolean  | Is the timeout active |

