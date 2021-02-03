---
id: use-queue-state
title: use-queue-state
sidebar_label: use-queue-state
---


    

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

    