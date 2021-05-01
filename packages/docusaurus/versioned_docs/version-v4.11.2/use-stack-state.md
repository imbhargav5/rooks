---
id: use-stack-state
title: use-stack-state
sidebar_label: use-stack-state
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

A React hook that manages state in the form of a stack

[//]: # "Main"

## Installation

    npm install --save @rooks/use-stack-state

## Importing the hook

```javascript
import useStackState from "@rooks/use-stack-state"
```

## Usage

```jsx
function Demo() {
  // here list is still 1,2,3
  // listInReverse is basically list in stack order. 
  // which is last-in first-out
  // so basically listInReverse = 3,2,1
  // controls contains utils to change the stack;
  const [list, controls, listInReverse] =  useStackState([1,2,3]);
  const {push, peek, pop, length} = controls;

  // push(1)
  // pop()
  // peek()
  
  // This will render items in LIFO order
  return <div>
    {listInStackOrder.map(item => <span>{item}</span>)}
  </div>
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage

<iframe 
    src="https://codesandbox.io/embed/bold-smoke-iedi8?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark"
    style={{
        width: "100%",
        height: 500,
        border: 0,
        borderRadius: 4,
        overflow: "hidden"
    }}
    title="use-stack-state"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" 
/>    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    