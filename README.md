<br/>
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
<br/>
<p align="center">
  <img src="https://i.gyazo.com/67b004be5aa811e9ccd8375b9ce274e1.png" height="300" style="margin: 200px 0" />
</p>
<br/>
<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks)

<br/>

Collection of regularly used custom hooks as utils for React

## [Website](https://react-hooks.org)

[![Image from Gyazo](https://i.gyazo.com/95e208eb09a97edee34eb65ef1be5367.png)](https://gyazo.com/95e208eb09a97edee34eb65ef1be5367)

# Features

✅ Collection of 22+ hooks as separate modules

✅ Standalone package with all the hooks at one place

✅ CommonJS, UMD and ESM Support

# Installation

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

# Documentation

## Standalone Package

Package containing all the hooks is over here. - [Docs](https://github.com/imbhargav5/rooks/tree/master/packages/rooks) and [Npm Install](https://npmjs.com/package/rooks)

<br/>

## Individual hooks as their own packages

| Hook                          | Source                                                                                | Documentation                                                        | Npm Install                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| @rooks/use-boundingclientrect | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/boundingclientrect) | [Docs and Demo](https://react-hooks.org/hook/use-boundingclientrect) | [Npm install](https://npmjs.com/package/@rooks/use-boundingclientrect) |
| @rooks/use-counter            | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/counter)            | [Docs and Demo](https://react-hooks.org/hook/use-counter)            | [Npm install](https://npmjs.com/package/@rooks/use-counter)            |
| @rooks/use-did-mount          | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/did-mount)          | [Docs and Demo](https://react-hooks.org/hook/use-did-mount)          | [Npm install](https://npmjs.com/package/@rooks/use-did-mount)          |
| @rooks/use-did-update         | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/did-update)         | [Docs and Demo](https://react-hooks.org/hook/use-did-update)         | [Npm install](https://npmjs.com/package/@rooks/use-did-update)         |
| @rooks/use-input              | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/input)              | [Docs and Demo](https://react-hooks.org/hook/use-input)              | [Npm install](https://npmjs.com/package/@rooks/use-input)              |
| @rooks/use-interval           | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/interval)           | [Docs and Demo](https://react-hooks.org/hook/use-interval)           | [Npm install](https://npmjs.com/package/@rooks/use-interval)           |
| @rooks/use-key                | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/key)                | [Docs and Demo](https://react-hooks.org/hook/use-key)                | [Npm install](https://npmjs.com/package/@rooks/use-key)                |
| @rooks/use-localstorage       | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/localstorage)       | [Docs and Demo](https://react-hooks.org/hook/use-localstorage)       | [Npm install](https://npmjs.com/package/@rooks/use-localstorage)       |
| @rooks/use-mouse              | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/mouse)              | [Docs and Demo](https://react-hooks.org/hook/use-mouse)              | [Npm install](https://npmjs.com/package/@rooks/use-mouse)              |
| @rooks/use-mutation-observer  | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/mutation-observer)  | [Docs and Demo](https://react-hooks.org/hook/use-mutation-observer)  | [Npm install](https://npmjs.com/package/@rooks/use-mutation-observer)  |
| @rooks/use-navigator-language | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/navigator-language) | [Docs and Demo](https://react-hooks.org/hook/use-navigator-language) | [Npm install](https://npmjs.com/package/@rooks/use-navigator-language) |
| @rooks/use-online             | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/online)             | [Docs and Demo](https://react-hooks.org/hook/use-online)             | [Npm install](https://npmjs.com/package/@rooks/use-online)             |
| @rooks/use-outside-click      | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/outside-click)      | [Docs and Demo](https://react-hooks.org/hook/use-outside-click)      | [Npm install](https://npmjs.com/package/@rooks/use-outside-click)      |
| @rooks/use-previous           | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/previous)           | [Docs and Demo](https://react-hooks.org/hook/use-previous)           | [Npm install](https://npmjs.com/package/@rooks/use-previous)           |
| @rooks/use-raf                | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/raf)                | [Docs and Demo](https://react-hooks.org/hook/use-raf)                | [Npm install](https://npmjs.com/package/@rooks/use-raf)                |
| @rooks/use-select             | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/select)             | [Docs and Demo](https://react-hooks.org/hook/use-select)             | [Npm install](https://npmjs.com/package/@rooks/use-select)             |
| @rooks/use-sessionstorage     | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/sessionstorage)     | [Docs and Demo](https://react-hooks.org/hook/use-sessionstorage)     | [Npm install](https://npmjs.com/package/@rooks/use-sessionstorage)     |
| @rooks/use-time-ago           | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/time-ago)           | [Docs and Demo](https://react-hooks.org/hook/use-time-ago)           | [Npm install](https://npmjs.com/package/@rooks/use-time-ago)           |
| @rooks/use-timeout            | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/timeout)            | [Docs and Demo](https://react-hooks.org/hook/use-timeout)            | [Npm install](https://npmjs.com/package/@rooks/use-timeout)            |
| @rooks/use-toggle             | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/toggle)             | [Docs and Demo](https://react-hooks.org/hook/use-toggle)             | [Npm install](https://npmjs.com/package/@rooks/use-toggle)             |
| @rooks/use-visibility-sensor  | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/visibility-sensor)  | [Docs and Demo](https://react-hooks.org/hook/use-visibility-sensor)  | [Npm install](https://npmjs.com/package/@rooks/use-visibility-sensor)  |
| @rooks/use-will-unmount       | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/will-unmount)       | [Docs and Demo](https://react-hooks.org/hook/use-will-unmount)       | [Npm install](https://npmjs.com/package/@rooks/use-will-unmount)       |
| @rooks/use-window-size        | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/window-size)        | [Docs and Demo](https://react-hooks.org/hook/use-window-size)        | [Npm install](https://npmjs.com/package/@rooks/use-window-size)        |
| @rooks/use-worker             | [Source](https://github.com/imbhargav5/rooks/tree/master/packages/worker)             | [Docs and Demo](https://react-hooks.org/hook/use-worker)             | [Npm install](https://npmjs.com/package/@rooks/use-worker)             |


<hr/>



### License - MIT

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/2936644?v=4" width="100px;" alt="Bhargav Ponnapalli"/><br /><sub><b>Bhargav Ponnapalli</b></sub>](https://imbhargav5.com/)<br />[💻](https://github.com/imbhargav5/rooks/commits?author=imbhargav5 "Code") [🤔](#ideas-imbhargav5 "Ideas, Planning, & Feedback") [🎨](#design-imbhargav5 "Design") [📖](https://github.com/imbhargav5/rooks/commits?author=imbhargav5 "Documentation") [🐛](https://github.com/imbhargav5/rooks/issues?q=author%3Aimbhargav5 "Bug reports") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!