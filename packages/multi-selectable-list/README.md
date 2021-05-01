# @rooks/use-multi-selectable-list

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/multi-selectable-list/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-multi-selectable-list/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-multi-selectable-list.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-multi-selectable-list.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fmulti-selectable-list)



## About
A custom hook to easily select multiple values from a list


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-multi-selectable-list
```

## Importing the hook

```javascript
import useMultiSelectableList from "@rooks/use-multi-selectable-list"
```

## Usage

```jsx
function Demo() {
  useMultiSelectableList();
  return null
}

render(<Demo/>)
```
