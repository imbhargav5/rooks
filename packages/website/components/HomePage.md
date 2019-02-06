# `rooks` 🎉

## Collection of React hooks ⚓ for everyone.

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/rooks/latest.svg) ![](https://img.shields.io/npm/l/rooks.svg) ![](https://img.shields.io/npm/dt/rooks.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fselect)

<br/>

## 🚀 Installation

### ▶ For a specific hook like useDidMount

```
npm i -s @rooks/use-did-mount
```

```
npm i -s @rooks/use-interval
```

```react
import useDidMount from "@rooks/use-did-mount";
```

### ▶ For standalone build with all the hooks

<b>Import any hook from "rooks" and start using them!</b>

```
npm i -s rooks
```

```react
import { useDidMount } from "rooks";
```

# 📖 Usage

```react
function App() {
  useDidMount(() => {
    console.log("mounted");
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

## 🎉 Hope you like it!

Contributions are welcome!

😄

## 📘 License - MIT
