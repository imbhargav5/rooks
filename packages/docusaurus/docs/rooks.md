---
id: rooks
title: rooks
sidebar_label: rooks      
slug: /
---

<br/>
<br/>
<img src="https://github.com/imbhargav5/rooks/raw/master/.github/assets/logo-dark.png" height="auto" width="100%" />

<br/>
<br/>

   

<br/>

## About

Standalone build for all rooks. This package contains all the hooks built as part of the rooks project.

**Note:** If you only need a few hooks from the rooks package, it's prefereable to install individiual hooks from npm instead of the standalone rooks build. In other words, install `@rooks/use-did-mount` instead of `rooks` if you only need the `use-did-mount` functionality.

## Installation

### For a specific hook like useDidMount

    npm i -s @rooks/use-did-mount

<!---->

    npm i -s @rooks/use-interval

```jsx
import useDidMount from "@rooks/use-did-mount";
```

### For standalone build with all the hooks

    npm i - s rooks

Import any hook from "rooks" and start using them!

```jsx
import { useDidMount } from "rooks";
```

## Usage

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

<br/>

## License

MIT


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    