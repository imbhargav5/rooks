---
id: use-fresh-ref
title: use-fresh-ref
sidebar_label: use-fresh-ref
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

Avoid stale state in callbacks with this hook. Auto updates values using a ref.

[//]: # "Main"

## Installation

    npm install --save @rooks/use-fresh-ref

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


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    