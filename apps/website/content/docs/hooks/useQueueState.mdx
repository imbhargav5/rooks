---
id: useQueueState
title: useQueueState
sidebar_label: useQueueState
---

## About

A React hook that manages state in the form of a queue

[//]: # "Main"

## Examples

```jsx
import React, { useRef } from "react";
import "./styles.css";
import { useQueueState } from "rooks";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

const variants = {
  appear: {
    opacity: 0,
    y: "-150%",
    x: "-15%",
    rotate: -15,
    transition: {
      duration: 0.5,
    },
  },
  disappear: {
    opacity: 0,
    y: "-200%",
    x: "100%",
    rotate: 45,
    transition: {
      duration: 0.5,
    },
  },
  visible: {
    opacity: 1,
    y: "0%",
    x: "0%",
    rotate: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const StackInner = styled(motion.div)`
  border-bottom: 5px solid black;
  padding: 0 12px 3px;
  width: 300px;
  > * {
    margin: 0;
    padding: 12px 16px;
  }
`;

export function StackDiv({ children, ...props }) {
  return (
    <StackInner {...props}>
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </StackInner>
  );
}

export const StackItem = styled(motion.div).attrs(props => ({
  variants,
  initial: "appear",
  animate: "visible",
  exit: "disappear",
}))`
  width: 100%;
  background-color: rgba(254, 243, 199, 1);
  margin: 0;
  padding: 12px 16px;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  border-color: rgba(0, 0, 0, 1);
  border-width: 1px;
  border-style: solid;
  border-radius: 0.375rem;
  place-content: center;
  display: flex;
`;

export const ActionButton = styled(motion.button)`
    width: 100%;
  font-weight: 500;
  color: rgba(67,56,202,1);
  font-size: 1rem;
  line-height: 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-color: transparent;
  align-items: center;
  display: inline-flex;
  border-radius: 0.375rem;
  border-color: transparent;
  background-color: rgba(224,231,255,1);
}
`;

export const ActionButton2 = styled(motion.button)`
  width: 100%;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-color: transparent;
  align-items: center;
  display: inline-flex;
  border-radius: 0.375rem;
  border-color: transparent;
  background-color: rgba(254, 226, 226, 1);
`;

export const ActionButtons = styled.div`
  margin: 12px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
`;

export const Root = styled.div`
  height: 100vh;
  padding-bottom: 100px;
  width: 300px;
  display: flex;
  align-items: flex-end;
  margin: auto;
  box-sizing: border-box;
`;

export default function App() {
  const numberToPushRef = useRef(3);
  const [list, { enqueue, dequeue }] = useQueueState([1, 2, 3]);

  function addToStack() {
    numberToPushRef.current = numberToPushRef.current + 1;
    enqueue(numberToPushRef.current);
  }

  return (
    <Root>
      <div>
        <StackDiv>
          {list.map(item => {
            return <StackItem key={item}>{item}</StackItem>;
          })}
        </StackDiv>
        <ActionButtons>
          <ActionButton onClick={addToStack}>enqueue</ActionButton>{" "}
          <ActionButton2 onClick={dequeue} warning>
            dequeue
          </ActionButton2>{" "}
        </ActionButtons>
      </div>
    </Root>
  );
}
```

### Arguments

| Arguments   | Type  | Description | Default value |
| ----------- | ----- | ----------- | ------------- |
| initialList | any[] | An array    | undefind      |

### Returned array items

| Returned items | Type     | Description                               |
| -------------- | -------- | ----------------------------------------- |
| enqueue        | function | Put an item to the end of the queue       |
| dequeue        | function | Remove the first item in the queue        |
| peek           | function | Return the item at the front of the queue |
| length         | number   | Number of items in the queue              |

---
