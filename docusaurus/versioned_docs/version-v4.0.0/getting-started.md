---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

### Installation a specific hook like useDidMount

    npm i -s @rooks/use-did-mount

<!---->

    npm i -s @rooks/use-interval

```jsx
import useDidMount from "@rooks/use-did-mount";
```

### Installation all the hooks in a single package

    npm i - s rooks

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