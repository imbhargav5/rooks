# @rooks/use-did-mount

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/did-mount/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-did-mount/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-did-mount.svg) ![](https://img.shields.io/npm/dt/@rooks/use-did-mount.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fdid-mount)




## About 
componentDidMount hook for React
<br/>

## Installation

```
npm install --save @rooks/use-did-mount
```

## Importing the hook

```javascript
import useDidMount from "@rooks/use-did-mount"
```


## Usage

```jsx
function Demo() {
  useDidMount(function(){
    console.log("mounted")
  });
  return null
}

render(<Demo/>)
```

### Arguments

| Argument | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| callback | function | function to be called on mount |

