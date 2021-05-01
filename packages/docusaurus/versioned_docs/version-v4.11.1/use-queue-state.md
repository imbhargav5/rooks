---
id: use-queue-state
title: use-queue-state
sidebar_label: use-queue-state
---


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

A React hook that manages state in the form of a queue

[//]: # "Main"

## Installation

    npm install --save @rooks/use-queue-state

## Importing the hook

```javascript
import useQueueState from "@rooks/use-queue-state"
```

## Usage

```jsx
function Demo() {
  // here list is still 1,2,3
  // controls contains utils to change the queue;
  const [list, controls] =  useQueueState([1,2,3]);
  const {enqueue, peek, dequeue, length} = controls;

  // enqueue(1)
  // dequeue()
  // peek()
  
  // This will render items in FIFO order
  return <div>
    {list.map(item => <span>{item}</span>)}
  </div>
}

render(<Demo/>)
```


---

## Codesandbox Examples

### Basic Usage    



## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    