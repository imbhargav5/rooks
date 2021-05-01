---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---



<!---->

 



### Installation 

    npm i - s rooks

### Importing the hooks

Import any hook from "rooks" and start using them!

```jsx
import { useDidMount } from "rooks";
```

### Usage

```jsx
function App() {
  useDidMount(() => {
    alert("mounted");
  });
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
```
