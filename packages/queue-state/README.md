# @rooks/use-queue-state

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/queue-state/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-queue-state/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-queue-state.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-queue-state.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fqueue-state)



## About
A React hook that manages state in the form of a queue


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-queue-state
```

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
