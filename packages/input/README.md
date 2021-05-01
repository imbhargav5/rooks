# @rooks/use-input

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/input/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-input/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-input.svg) ![](https://img.shields.io/npm/dt/@rooks/use-input.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Finput)




## About 
Input hook for React.
<br/>


## Installation

```
npm install --save @rooks/use-input
```

## Importing the hook

```javascript
import useInput from "@rooks/use-input"
```


## Usage

**Base**

```jsx
function Demo() {
  const myInput = useInput("hello");
  return (
    <div>
      <input {...myInput} />
      <p>
        Value is <b>{myInput.value}</b>
      </p>
    </div>
  );
}

render(<Demo/>)
```

**With optional validator**

```jsx
function Demo() {
  const myInput = useInput("hello", {
    validate: (newValue) => newValue.length < 15
  });
  return (
    <div>
      <p> Max length 15 </p>
      <input {...myInput} />
      <p>
        Value is <b>{myInput.value}</b>
      </p>
    </div>
  );
}

render(<Demo/>)
```

### Arguments

| Argument     | Type   | Description                 | Default value |
| ------------ | ------ | --------------------------- | ------------- |
| initialValue | string | Initial value of the string | ""            |
| opts         | object | Options                     | {}            |


### Options

| Option key | Type     | Description                                                                                                             | Default value |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ------------- |
| validate   | function | Validator function which receives changed valued before update as well as current value and should return true or false | undefined     |

### Return value

| Return value      | Type   | Description                                                                                                          |
| ----------------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| {value, onChange} | Object | Object containing {value : "String", onChange: "function that accepts an event and updates the value of the string"} |

