# `rooks`

Standalone build for all rooks.

## Installation

```
npm i -s rooks
```

## Usage

Import any hook from "rooks" and start using them!

```jsx
import { useDidMount } from "rooks";

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
