# @rooks/use-will-unmount

### Installation

```
npm install --save @rooks/use-will-unmount
```

### Usage

```react

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

# A React hook for componentWillUnmount lifecycle method
