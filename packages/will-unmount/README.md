# @rooks/use-will-unmount

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/will-unmount/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-will-unmount/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-will-unmount.svg) ![](https://img.shields.io/npm/dt/@rooks/use-will-unmount.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fwill-unmount)




## About 
componentWillUnmount lifecycle as hook for React.
<br/>

## Installation

```
npm install --save @rooks/use-will-unmount
```

## Importing the hook

```javascript
import useWillUnmount from "@rooks/use-will-unmount"
```


## Usage

```jsx

function Message(){

  useWillUnmount(function () {
    alert("unmounted")
  })
  return <p> Message </p>
}


function Demo() {
  const [
    value,
    changeValue
   ] = useState(true);

  function toggleValue(){
    changeValue(!value)
  }

  return <>
    <p><button onClick={toggleValue}>Toggle show </button></p>
    {value && <Message/>}
  </>;
}

render(<Demo/>)
```

### Arguments

| Arguments | Type     | Description                                     | Default value |
| --------- | -------- | ----------------------------------------------- | ------------- |
| callback  | function | Callback function which needs to run on unmount | undefined     |

# A React hook for componentWillUnmount lifecycle method.
