# @rooks/use-will-unmount

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) 

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-will-unmount
```

### Usage

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
