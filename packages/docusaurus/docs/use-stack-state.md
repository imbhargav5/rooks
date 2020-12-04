---
id: use-stack-state
title: use-stack-state
sidebar_label: use-stack-state
---


    

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



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    