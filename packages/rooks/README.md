# `rooks`

Standalone build for all rooks. This package contains all the hooks built as part of the rooks project.

**Note:** If you only need a few hooks from the rooks package, it's prefereable to install individiual hooks from npm instead of the standalone rooks build. In other words, install `@rooks/use-did-mount` instead of `rooks` if you only need the `use-did-mount` functionality.

<br/>
<br/>
<p align="center">
  <img src="https://i.gyazo.com/67b004be5aa811e9ccd8375b9ce274e1.png" height="150" style="margin: 20px 0" />
</p>
<br/>
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/rooks/latest.svg) ![](https://img.shields.io/npm/l/rooks.svg) ![](https://img.shields.io/npm/dt/rooks.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fselect)

<br/>

## Installation

### For a specific hook like useDidMount

```
npm i -s @rooks/use-did-mount
```

```
npm i -s @rooks/use-interval
```

```jsx
import useDidMount from "@rooks/use-did-mount";
```

### For standalone build with all the hooks

```
npm i - s rooks
```

Import any hook from "rooks" and start using them!

```jsx
import { useDidMount } from "rooks";
```

# Usage

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

## Hope you like it!

Feel free to join as contributors!

:smile:

### License - MIT
