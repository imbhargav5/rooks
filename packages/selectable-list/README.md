# @rooks/use-selectable-list

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/selectable-list/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-selectable-list/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-selectable-list.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-selectable-list.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fselectable-list)



## About
Easily select a single value from a list of values. very useful for radio buttons, select inputs  etc. 


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-selectable-list
```

## Importing the hook

```javascript
import useSelectableList from "@rooks/use-selectable-list"
```

## Usage

```jsx
function Demo() {
  useSelectableList();
  return null
}

render(<Demo/>)
```
