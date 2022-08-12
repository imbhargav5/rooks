---
id: useArrayState
title: useArrayState
sidebar_label: useArrayState
---

## About

Array state manager hook for React. It exposes push, pop, unshift, shift, concat, fill and reverse methods to be able to easily modify the state of an array.

## Examples

```jsx
import { useArrayState, useInput } from "rooks";
export default function App() {
  const [array, controls] = useArrayState([1, 2, 3]);
  const numberInput = useInput(0);

  return <div>
        <p> Array items are - {array.join(",")} </p>
    <input {...numberInput} type="number"/>    
    <button onClick={() => {
       controls.push(Number.parseInt(numberInput.value));       
       numberInput.onChange({target: {value: 0}});
    }}> Push value</button>
  </div>;
}

```
