---
id: useQueueState
title: useQueueState
sidebar_label: useQueueState
---

## About

A React hook that manages state in the form of a queue

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useQueueState } from "rooks";
```

## Usage

```jsx
function Demo() {
  // here list is still 1,2,3
  // controls contains utils to change the queue;
  const [list, controls] = useQueueState([1, 2, 3]);
  const { enqueue, peek, dequeue, length } = controls;

  // enqueue(1)
  // dequeue()
  // peek()

  // This will render items in FIFO order
  return (
    <div>
      {list.map((item) => (
        <span>{item}</span>
      ))}
    </div>
  );
}

render(<Demo />);
```

### Arguments

| Arguments   | Type  | Description | Default value |
|-------------|-------|-------------|---------------|
| initialList | any[] | An array    | undefind      |

### Returned array items

| Returned items | Type     | Description                               |
|----------------|----------|-------------------------------------------|
| enqueue        | function | Put an item to the end of the queue       |
| dequeue        | function | Remove the first item in the queue        |
| peek           | function | Return the item at the front of the queue |
| length         | number   | Number of items in the queue              |

---

## Codesandbox Examples

### Basic Usage

<iframe 
  src="https://codesandbox.io/embed/usequeuestate-dhvnu?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }}
  title="useQueueState"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" 
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
